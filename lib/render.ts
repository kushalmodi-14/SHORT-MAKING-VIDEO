import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { BeatsJson } from './types';
import { updateJob } from './jobs';
import { synthesizeVoiceNode, getFfmpegPath } from './tts';

const ROOT_DIR = process.cwd();
const IS_VERCEL = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BASE_DIR = IS_VERCEL ? path.join(os.tmpdir(), 'faceless-shorts') : ROOT_DIR;
const PUBLIC_VIDEOS_DIR = IS_VERCEL
  ? path.join(os.tmpdir(), 'videos')
  : path.join(ROOT_DIR, 'public', 'videos');
const SHORTS_DIR = path.join(BASE_DIR, 'shorts');
const REMOTION_DIR = path.join(ROOT_DIR, 'remotion');

export async function runGenerationPipeline(
  jobId: string,
  beats: BeatsJson,
  _initialTsxCode: string,
  _initialVoGenTs: string
): Promise<string> {
  // 1. Ensure required writable directories exist
  if (!fs.existsSync(PUBLIC_VIDEOS_DIR)) {
    fs.mkdirSync(PUBLIC_VIDEOS_DIR, { recursive: true });
  }

  const shortSlug = beats.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const shotDir = path.join(SHORTS_DIR, shortSlug);
  if (!fs.existsSync(shotDir)) {
    fs.mkdirSync(shotDir, { recursive: true });
  }

  const beatsPath = path.join(shotDir, 'beats.json');
  fs.writeFileSync(beatsPath, JSON.stringify(beats, null, 2), 'utf-8');

  // 2. Synthesize audio voiceover (pure Node.js — no Python required on Vercel)
  updateJob(jobId, {
    status: 'synthesizing_voice',
    progress: 25,
    message: 'Synthesizing voiceover narration with exact word sync...',
  });

  const vdir = path.join(shotDir, 'voice');
  let activeBeats = beats;
  let voiceWavPath = '';

  try {
    const { voiceWavPath: synthesizedPath, updatedVo } = await synthesizeVoiceNode(beats, vdir);
    voiceWavPath = synthesizedPath;
    activeBeats.vo = updatedVo;
    fs.writeFileSync(beatsPath, JSON.stringify(activeBeats, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('Voice synthesis step warning:', err.message);
  }

  // 3. Prepare parameterized inputProps for the ShortTemplate composition
  updateJob(jobId, {
    status: 'rendering',
    progress: 45,
    message: 'Preparing Remotion rendering environment...',
    beats: activeBeats,
  });

  const inputProps = {
    title: activeBeats.title,
    kicker: (
      activeBeats.beats?.find((b) => b.kicker)?.kicker ||
      activeBeats.niche ||
      'EXPLAINED'
    ).toUpperCase(),
    windowTitle: `${(activeBeats.niche || 'Topic').toUpperCase()} — OVERVIEW`,
    terminalSession: activeBeats.terminalSession || [],
    vo: activeBeats.vo || [],
    durationSec: activeBeats.format?.durationSec || 35,
  };

  const destinationName = `${activeBeats.composition}.mp4`;
  const rawRenderedFile = path.join(
    IS_VERCEL ? os.tmpdir() : path.join(REMOTION_DIR, 'out'),
    `raw-${destinationName}`
  );
  const rawRenderDir = path.dirname(rawRenderedFile);
  if (!fs.existsSync(rawRenderDir)) {
    fs.mkdirSync(rawRenderDir, { recursive: true });
  }

  // 4. Render Remotion video frames
  updateJob(jobId, {
    status: 'rendering',
    progress: 50,
    renderPercent: 0,
    message: `${activeBeats.composition}: 0%`,
  });

  if (IS_VERCEL) {
    // Vercel Serverless Function mode: render via @remotion/renderer and @sparticuz/chromium
    const { selectComposition, renderMedia } = await import(/* webpackIgnore: true */ '@remotion/renderer');
    const chromium = (await import(/* webpackIgnore: true */ '@sparticuz/chromium')).default;

    chromium.setGraphicsMode = false;
    const executablePath = await chromium.executablePath();

    // Prefer pre-bundled Remotion build to avoid runtime bundling overhead and missing dependencies
    const prebuiltBundle = path.join(ROOT_DIR, 'remotion-build');
    let serveUrl: string;

    if (fs.existsSync(path.join(prebuiltBundle, 'index.html'))) {
      serveUrl = prebuiltBundle;
    } else {
      const { bundle } = await import(/* webpackIgnore: true */ '@remotion/bundler');
      serveUrl = await bundle({
        entryPoint: path.join(REMOTION_DIR, 'src', 'index.ts'),
        outDir: path.join(os.tmpdir(), 'remotion-bundle'),
      });
    }

    const composition = await selectComposition({
      serveUrl,
      id: 'ShortTemplate',
      inputProps,
      browserExecutable: executablePath,
      chromiumOptions: {
        args: chromium.args,
      },
    });

    await renderMedia({
      serveUrl,
      composition,
      inputProps,
      outputLocation: rawRenderedFile,
      codec: 'h264',
      browserExecutable: executablePath,
      chromiumOptions: {
        args: chromium.args,
      },
      onProgress: ({ progress }: { progress: number }) => {
        const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));
        const overallProgress = Math.min(95, 50 + Math.round(pct * 0.45));
        updateJob(jobId, {
          status: 'rendering',
          progress: overallProgress,
          renderPercent: pct,
          message: `${activeBeats.composition}: ${pct}%`,
        });
      },
    });
  } else {
    // Local development mode: execute render via local Remotion scripts
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        'node',
        ['scripts/render-all.mjs', 'ShortTemplate', '--scale=1'],
        { cwd: REMOTION_DIR, shell: true }
      );

      let errorOutput = '';

      child.stdout.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        process.stdout.write(text);

        const match = text.match(/(\d{1,3})%/);
        if (match) {
          const pct = Math.min(100, Math.max(0, parseInt(match[1], 10)));
          const overallProgress = Math.min(95, 50 + Math.round(pct * 0.45));
          updateJob(jobId, {
            status: 'rendering',
            progress: overallProgress,
            renderPercent: pct,
            message: `${activeBeats.composition}: ${pct}%`,
          });
        }
      });

      child.stderr.on('data', (chunk: Buffer) => {
        const text = chunk.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      child.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Render failed (code ${code}): ${errorOutput.slice(-300)}`));
      });

      child.on('error', (err) => reject(err));
    });

    const localOut = path.join(REMOTION_DIR, 'out', 'ShortTemplate.mp4');
    if (fs.existsSync(localOut)) {
      fs.copyFileSync(localOut, rawRenderedFile);
    }
  }

  // 5. Audio-Video Muxing using ffmpeg-static (no system ffmpeg install required)
  const finalVoicedMp4 = path.join(PUBLIC_VIDEOS_DIR, destinationName);
  const voiceWav = voiceWavPath || path.join(vdir, 'voice.wav');
  const ffmpegBin = getFfmpegPath();

  if (fs.existsSync(voiceWav) && fs.existsSync(rawRenderedFile)) {
    updateJob(jobId, {
      progress: 98,
      message: 'Muxing voiceover narration onto video...',
    });

    const duration = activeBeats.format?.durationSec || 35;
    await new Promise<void>((resolve) => {
      const proc = spawn(ffmpegBin, [
        '-y',
        '-v',
        'error',
        '-i',
        rawRenderedFile,
        '-i',
        voiceWav,
        '-map',
        '0:v',
        '-map',
        '1:a',
        '-c:v',
        'copy',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-t',
        String(duration),
        finalVoicedMp4,
      ]);

      proc.on('close', () => resolve());
      proc.on('error', () => {
        // Fallback to video copy if muxing fails
        fs.copyFileSync(rawRenderedFile, finalVoicedMp4);
        resolve();
      });
    });
  } else if (fs.existsSync(rawRenderedFile)) {
    fs.copyFileSync(rawRenderedFile, finalVoicedMp4);
  }

  const videoUrl = `/api/videos/${destinationName}`;

  updateJob(jobId, {
    status: 'completed',
    progress: 100,
    renderPercent: 100,
    message: `${activeBeats.composition}: Complete with audio!`,
    videoUrl,
  });

  return videoUrl;
}
