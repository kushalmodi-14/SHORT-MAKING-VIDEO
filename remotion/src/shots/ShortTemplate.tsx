import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigTitle, Captions, ProgressBar, ShortsBackdrop, Kicker, VoLine } from '../lib/shorts';
import { TerminalWindow, TermLine } from '../lib/terminal';

export interface ShortTemplateProps {
  id?: string;
  title?: string;
  kicker?: string;
  windowTitle?: string;
  terminalSession?: TermLine[];
  vo?: VoLine[];
  durationSec?: number;
}

export const defaultShortProps: ShortTemplateProps = {
  title: 'Redis Caching in Node.js',
  kicker: 'SPEED BOOST',
  windowTitle: 'REDIS — OVERVIEW',
  terminalSession: [
    { kind: 'cmd', text: 'npm i ioredis', at: 0, type: true },
    { kind: 'ok', text: '+ ioredis@5.3.2 installed', at: 45 },
    { kind: 'cmd', text: 'cat cache.js', at: 90, type: true },
    { kind: 'out', text: "const redis = new Redis();", at: 150 },
    { kind: 'ok', text: 'Response: 2ms (was 450ms)', at: 240, hl: '#f5d76e' },
    { kind: 'dim', text: '# 200x performance boost', at: 320 }
  ],
  vo: [
    { text: "Your API is slow. Let's fix that with Redis.", start: 0.2, end: 3.5 }
  ],
  durationSec: 35,
};

export const compositionConfig = {
  id: 'ShortTemplate',
  durationInSeconds: 35,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BOX = { x: 58, y: 380, w: 964, h: 980 };
const TERM = { fontSize: 26, lineH: 42, pad: 28, title: 'app — zsh', promptPath: 'app' } as const;

export const ShortTemplate: React.FC<ShortTemplateProps> = (props) => {
  const session = props.terminalSession && props.terminalSession.length > 0
    ? props.terminalSession
    : defaultShortProps.terminalSession!;
  const vo = props.vo && props.vo.length > 0 ? props.vo : defaultShortProps.vo!;
  const title = props.title || defaultShortProps.title!;
  const kicker = props.kicker || defaultShortProps.kicker!;
  const winTitle = props.windowTitle || `${title.slice(0, 24)} — zsh`;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ShortsBackdrop />
      <Kicker text={kicker} color="#f5d76e" y={90} />
      <BigTitle
        lines={[
          { text: title.slice(0, 32), color: '#f5d76e' },
          { text: 'Explained in 35 seconds' }
        ]}
        y={150}
        size={66}
        warm
      />
      <TerminalWindow box={BOX} lines={session} {...TERM} title={winTitle} />
      <Captions lines={vo} y={1480} size={54} plate />
      <ProgressBar color="#f5d76e" />
    </AbsoluteFill>
  );
};

export default ShortTemplate;
