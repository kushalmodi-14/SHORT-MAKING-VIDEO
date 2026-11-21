import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { BeatsJson, VoLine } from './types';

// Resolve ffmpeg binary path dynamically
let ffmpegPath = 'ffmpeg';
try {
  const staticFfmpeg = require('ffmpeg-static');
  if (staticFfmpeg) {
    ffmpegPath = typeof staticFfmpeg === 'string' ? staticFfmpeg : staticFfmpeg.path || 'ffmpeg';
  }
} catch {
  ffmpegPath = 'ffmpeg';
}

export function getFfmpegPath(): string {
  return ffmpegPath;
}

function charsToWords(chars: string[], starts: number[], ends: number[]) {
  const words: { w: string; start: number; end: number }[] = [];
  let cur = '';
  let wStart: number | null = null;
  let wEnd: number | null = null;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const s = starts[i];
    const e = ends[i];

    if (/\s/.test(ch)) {
      if (cur) {
        words.push({ w: cur, start: Number(wStart!.toFixed(3)), end: Number(wEnd!.toFixed(3)) });
        cur = '';
        wStart = null;
      }
      continue;
    }

    if (!cur) {
      wStart = s;
    }
    cur += ch;
    wEnd = e;
  }

  if (cur && wStart !== null && wEnd !== null) {
    words.push({ w: cur, start: Number(wStart.toFixed(3)), end: Number(wEnd.toFixed(3)) });
  }

  return words;
}

export async function synthesizeVoiceNode(
  beats: BeatsJson,
  vdir: string
): Promise<{ voiceWavPath: string; updatedVo: VoLine[] }> {
  if (!fs.existsSync(vdir)) {
    fs.mkdirSync(vdir, { recursive: true });
  }

  const rawKey = (process.env.ELEVENLABS_API_KEY || '').replace(/^["']|["']$/g, '').trim();
  const voiceId = 'TX3LPaxmHKxFdv7VOQHJ'; // Premade "Liam"
  const vo = beats.vo;
  const fittedLines: { file: string; start: number; dur: number }[] = [];

  for (let i = 0; i < vo.length; i++) {
    const line = vo[i];
    const lineFile = path.join(vdir, `line-${i}.mp3`);
    let words: { w: string; start: number; end: number }[] = [];
    let audioBuffer: Buffer | null = null;

    if (rawKey) {
      try {
        const resp = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': rawKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: line.text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.3,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (resp.ok) {
          const data = await resp.json();
          audioBuffer = Buffer.from(data.audio_base64, 'base64');
          const align = data.alignment || {};
          words = charsToWords(
            align.characters || [],
            align.character_start_times_seconds || [],
            align.character_end_times_seconds || []
          );
        }
      } catch (err) {
        console.warn('ElevenLabs API request failed, falling back:', err);
      }
    }

    // Fallback: estimate word timings if audio buffer is synthesized or estimated
    const lineDuration = Math.max(1, line.end - line.start);
    if (!words || words.length === 0) {
      const parts = line.text.split(/\s+/).filter(Boolean);
      const step = lineDuration / Math.max(1, parts.length);
      words = parts.map((w, idx) => ({
        w,
        start: Number((idx * step).toFixed(3)),
        end: Number(((idx + 1) * step).toFixed(3)),
      }));
    }

    if (audioBuffer) {
      fs.writeFileSync(lineFile, audioBuffer);
      fittedLines.push({ file: lineFile, start: line.start, dur: lineDuration });
    }

    line.words = words.map((w) => ({
      w: w.w,
      start: Number((line.start + w.start).toFixed(2)),
      end: Number((line.start + w.end).toFixed(2)),
    }));
  }

  const voiceWavPath = path.join(vdir, 'voice.wav');

  // If audio files were generated, assemble them with ffmpeg
  if (fittedLines.length > 0) {
    await new Promise<void>((resolve, reject) => {
      const args: string[] = ['-y', '-v', 'error'];
      fittedLines.forEach((l) => args.push('-i', l.file));

      const parts: string[] = [];
      fittedLines.forEach((l, idx) => {
        const ms = Math.round(l.start * 1000);
        parts.push(`[${idx}:a]adelay=${ms}|${ms}[a${idx}]`);
      });

      const chain = fittedLines.map((_, idx) => `[a${idx}]`).join('');
      const totalDur = beats.format.durationSec || 35;
      const filterComplex = `${parts.join(';')};${chain}amix=inputs=${fittedLines.length}:normalize=0,apad,atrim=0:${totalDur}[out]`;

      args.push(
        '-filter_complex',
        filterComplex,
        '-map',
        '[out]',
        '-ar',
        '44100',
        '-ac',
        '2',
        voiceWavPath
      );

      const proc = spawn(ffmpegPath, args);
      proc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`FFmpeg audio assembly exited with code ${code}`));
      });
      proc.on('error', (err) => reject(err));
    });
  }

  return { voiceWavPath, updatedVo: vo };
}
