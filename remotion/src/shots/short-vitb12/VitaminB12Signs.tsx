import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigTitle, Captions, ProgressBar, ShortsBackdrop, Kicker } from '../../lib/shorts';
import { TerminalWindow, TermLine } from '../../lib/terminal';
import { VO } from './vo.gen';

export const compositionConfig = {
  id: 'VitaminB12Signs',
  durationInSeconds: 35,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BOX = { x: 58, y: 380, w: 964, h: 980 };
const TERM = { fontSize: 26, lineH: 42, pad: 28, title: "HEALTH — OVERVIEW", promptPath: 'app' } as const;

const SESSION: TermLine[] = [
  {
    "kind": "cmd",
    "text": "Feeling tired, dizzy, or just off? You mig...",
    "at": 6,
    "type": true
  },
  {
    "kind": "ok",
    "text": "Most people think B12 deficiency only caus...",
    "at": 120,
    "type": false
  },
  {
    "kind": "out",
    "text": "Numbness or tingling in hands and feet. Pe...",
    "at": 300,
    "type": false,
    "hl": "#f5d76e"
  },
  {
    "kind": "ok",
    "text": "The fastest fix? A single 1000 µg B12 spra...",
    "at": 720,
    "type": false
  },
  {
    "kind": "out",
    "text": "Watch for these signs, boost your B12, and...",
    "at": 900,
    "type": false
  }
];

export const VitaminB12Signs: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ShortsBackdrop />
      <Kicker text="HOOK" color="#f5d76e" y={90} />
      <BigTitle
        lines={[
          { text: "3 Surprising Signs of Vitamin ...", color: '#f5d76e' },
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

export default VitaminB12Signs;
