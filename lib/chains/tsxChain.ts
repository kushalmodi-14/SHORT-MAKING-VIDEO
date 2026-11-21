import { BeatsJson } from '../types';

export function buildVoGenTs(voLines: BeatsJson['vo']): string {
  const linesFormatted = voLines.map((line) => {
    const words =
      line.words && line.words.length > 0
        ? line.words
        : line.text.split(/\s+/).map((word, idx, arr) => {
            const step = (line.end - line.start) / Math.max(arr.length, 1);
            return {
              w: word,
              start: Number((line.start + idx * step).toFixed(2)),
              end: Number((line.start + (idx + 1) * step).toFixed(2)),
            };
          });

    return `  { text: ${JSON.stringify(line.text)}, start: ${line.start}, end: ${line.end}, words: ${JSON.stringify(words)} }`;
  });

  return `// AUTO-GENERATED VO timings for Remotion Captions
import type { VoLine } from '../../lib/shorts';

export const VO: VoLine[] = [
${linesFormatted.join(',\n')}
];
`;
}

export function synthesizeBulletproofTsx(beats: BeatsJson): string {
  const validKinds = new Set(['cmd', 'out', 'dim', 'warn', 'err', 'ok', 'path']);

  // Format terminal session or fallback to structured breakdown lines
  const rawSession =
    beats.terminalSession && beats.terminalSession.length > 0
      ? beats.terminalSession
      : beats.vo.map((v, idx) => ({
          kind: idx === 0 ? 'cmd' : idx % 2 === 1 ? 'ok' : 'out',
          text: v.text.length > 45 ? v.text.slice(0, 42) + '...' : v.text,
          at: Math.round(v.start * 30),
          type: idx === 0,
          hl: idx === 2 ? '#f5d76e' : undefined,
        }));

  const session = rawSession.map((item) => ({
    kind: validKinds.has(item.kind) ? item.kind : 'out',
    text: item.text,
    at: typeof item.at === 'number' ? item.at : 0,
    type: Boolean(item.type),
    ...(item.hl ? { hl: item.hl } : {}),
  }));

  const titleClean = beats.title.replace(/"/g, "'");
  const titlePart1 = titleClean.length > 32 ? titleClean.slice(0, 30) + '...' : titleClean;
  const kickerText = (beats.beats.find((b) => b.kicker)?.kicker || beats.niche || 'EXPLAINED').toUpperCase();
  const windowTitle = `${(beats.niche || 'Insight').toUpperCase()} — OVERVIEW`;

  return `import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigTitle, Captions, ProgressBar, ShortsBackdrop, Kicker } from '../../lib/shorts';
import { TerminalWindow, TermLine } from '../../lib/terminal';
import { VO } from './vo.gen';

export const compositionConfig = {
  id: '${beats.composition}',
  durationInSeconds: ${beats.format?.durationSec || 35},
  fps: ${beats.format?.fps || 30},
  width: ${beats.format?.width || 1080},
  height: ${beats.format?.height || 1920},
};

const BOX = { x: 58, y: 380, w: 964, h: 980 };
const TERM = { fontSize: 26, lineH: 42, pad: 28, title: ${JSON.stringify(windowTitle)}, promptPath: 'app' } as const;

const SESSION: TermLine[] = ${JSON.stringify(session, null, 2)};

export const ${beats.composition}: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ShortsBackdrop />
      <Kicker text=${JSON.stringify(kickerText)} color="#f5d76e" y={90} />
      <BigTitle
        lines={[
          { text: ${JSON.stringify(titlePart1)}, color: '#f5d76e' },
          { text: "Breakdown in 35 seconds" }
        ]}
        y={150}
        size={66}
        warm
      />
      <TerminalWindow box={BOX} lines={SESSION} {...TERM} />
      <Captions lines={VO} y={1480} size={54} plate />
      <ProgressBar color="#f5d76e" />
    </AbsoluteFill>
  );
};

export default ${beats.composition};
`;
}

export async function generateTsx(beats: BeatsJson, apiKey?: string): Promise<string> {
  return synthesizeBulletproofTsx(beats);
}
