import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigTitle, Captions, ProgressBar, ShortsBackdrop, Kicker } from '../../lib/shorts';
import { TerminalWindow, TermLine } from '../../lib/terminal';
import { VO } from './vo.gen';

export const compositionConfig = {
  id: 'ShortExample',
  durationInSeconds: 35,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BOX = { x: 58, y: 380, w: 964, h: 980 };
const TERM = { fontSize: 26, lineH: 42, pad: 28, title: "TERMINAL — OVERVIEW", promptPath: 'app' } as const;

const SESSION: TermLine[] = [
  {
    "kind": "cmd",
    "text": "curl -s https://api.un.org/warstats | jq '.'",
    "at": 0,
    "type": true
  }
];

export const ShortExample: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ShortsBackdrop />
      <Kicker text="HOOK" color="#f5d76e" y={90} />
      <BigTitle
        lines={[
          { text: "War's Hidden Cost", color: '#f5d76e' },
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

export default ShortExample;
