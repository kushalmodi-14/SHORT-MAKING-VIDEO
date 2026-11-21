import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigTitle, Captions, ProgressBar, ShortsBackdrop, Kicker } from '../../lib/shorts';
import { TerminalWindow, TermLine } from '../../lib/terminal';
import { VO } from './vo.gen';

export const compositionConfig = {
  id: 'RedisCacheShort',
  durationInSeconds: 35,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BOX = { x: 58, y: 380, w: 964, h: 980 };
const TERM = { fontSize: 26, lineH: 42, pad: 28, title: 'redis-cache — zsh', promptPath: 'app' } as const;

const SESSION: TermLine[] = [
  { kind: 'cmd', text: 'npm i ioredis', at: 0, type: true },
  { kind: 'ok', text: '+ ioredis@5.3.2 installed', at: 60 },
  { kind: 'cmd', text: 'cat cache.js', at: 120, type: true },
  { kind: 'out', text: "const redis = new Redis();", at: 180 },
  { kind: 'out', text: "const cached = await redis.get('data');", at: 230 },
  { kind: 'warn', text: "if (cached) return JSON.parse(cached);", at: 290, hl: '#f5d76e' },
  { kind: 'out', text: "const fresh = await fetchFromDB();", at: 360 },
  { kind: 'out', text: "await redis.set('data', JSON.stringify(fresh), 'EX', 60);", at: 420 },
  { kind: 'ok', text: "Response: 2ms (was 450ms)", at: 510 },
  { kind: 'dim', text: '# 200x faster response time', at: 600 }
];

export const RedisCacheShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ShortsBackdrop />
      <Kicker text="NODE.JS SPEED BOOST" color="#f5d76e" y={90} />
      <BigTitle
        lines={[
          { text: 'Redis Caching in Node.js', color: '#f5d76e' },
          { text: 'Cut latency from 450ms to 2ms' }
        ]}
        y={150}
        size={68}
        warm
      />
      <TerminalWindow box={BOX} lines={SESSION} {...TERM} />
      <Captions lines={VO} y={1480} size={54} plate />
      <ProgressBar color="#f5d76e" />
    </AbsoluteFill>
  );
};

export default RedisCacheShort;
