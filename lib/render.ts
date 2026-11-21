import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BeatsJson } from './types';
import { updateJob } from './jobs';
import { generateTsx } from './chains/tsxChain';

const ROOT_DIR = process.cwd();
const REMOTION_DIR = path.join(ROOT_DIR, 'remotion');
const SHORTS_DIR = path.join(ROOT_DIR, 'shorts');
const PUBLIC_VIDEOS_DIR = path.join(ROOT_DIR, 'public', 'videos');

export async function runGenerationPipeline(
  jobId: string,
  beats: BeatsJson,
  _initialTsxCode: string,
  _initialVoGenTs: string
): Promise<string> {
  // Ensure directories exist
  if (!fs.existsSync(PUBLIC_VIDEOS_DIR)) {
    fs.mkdirSync(PUBLIC_VIDEOS_DIR, { recursive: true });
  }

  const shortSlug = beats.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const shotDir = path.join(SHORTS_DIR, shortSlug);
  if (!fs.existsSync(shotDir)) {
    fs.mkdirSync(shotDir, { recursive: true });
  }

  const remotionShotDir = path.join(REMOTION_DIR, 'src', 'shots', shortSlug);
  if (!fs.existsSync(remotionShotDir)) {
    fs.mkdirSync(remotionShotDir, { recursive: true });
  }

  // 1. Write initial beats contract
  const beatsPath = path.join(shotDir, 'beats.json');
  fs.writeFileSync(beatsPath, JSON.stringify(beats, null, 2), 'utf-8');

  // 2. Synthesize audio voiceover with word timestamps
  updateJob(jobId, {
    status: 'synthesizing_voice',
    progress: 25,
    message: 'Synthesizing voiceover narration with exact word sync...',
  });

  const voGenTsPath = path.join(remotionShotDir, 'vo.gen.ts');
  try {
    execSync(`python tools/gen_voice.py --beats "${beatsPath}" --emit-ts "${voGenTsPath}"`, {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    });
  } catch (err: any) {
    console.warn('Voice synthesis step warning:', err.message);
  }

  // Reload updated beats (contains real tempo-adjusted line durations and word times)
  let activeBeats = beats;
  try {
    if (fs.existsSync(beatsPath)) {
      activeBeats = JSON.parse(fs.readFileSync(beatsPath, 'utf-8'));
    }
  } catch {}

  // 3. Generate production TSX composition synced with the exact audio timing
  updateJob(jobId, {
    status: 'generating_tsx',
    progress: 40,
    message: 'Generating visual Remotion TSX composition...',
    beats: activeBeats,
  });

  const tsxCode = await generateTsx(activeBeats);
  fs.writeFileSync(path.join(remotionShotDir, `${activeBeats.composition}.tsx`), tsxCode, 'utf-8');

  // 4. Update composition registry
  updateJob(jobId, {
    status: 'rendering',
    progress: 48,
    message: 'Updating Remotion composition registry...',
  });

  execSync('node scripts/gen-registry.mjs', { cwd: REMOTION_DIR, stdio: 'inherit' });

  // 5. Render video frames with real-time frame percentage streaming
  updateJob(jobId, {
    status: 'rendering',
    progress: 50,
    renderPercent: 0,
    message: `${activeBeats.composition}: 0%`,
  });

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      'node',
      ['scripts/render-all.mjs', activeBeats.composition, '--scale=1'],
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
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Render failed (code ${code}): ${errorOutput.slice(-300)}`));
      }
    });

    child.on('error', (err) => reject(err));
  });

  const rawRenderedFile = path.join(REMOTION_DIR, 'out', `${activeBeats.composition}.mp4`);
  if (!fs.existsSync(rawRenderedFile)) {
    throw new Error(`Rendered video file not found at: ${rawRenderedFile}`);
  }

  // 6. Mux studio audio onto the rendered MP4
  const destinationName = `${activeBeats.composition}.mp4`;
  const finalVoicedMp4 = path.join(PUBLIC_VIDEOS_DIR, destinationName);
  const voiceWav = path.join(shotDir, 'voice', 'voice.wav');

  if (fs.existsSync(voiceWav)) {
    updateJob(jobId, {
      progress: 98,
      message: 'Muxing voiceover narration onto video...',
    });

    const duration = activeBeats.format?.durationSec || 35;
    execSync(
      `ffmpeg -y -v error -i "${rawRenderedFile}" -i "${voiceWav}" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t ${duration} "${finalVoicedMp4}"`
    );
  } else {
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
