import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BigTitle, Captions, ProgressBar, ShortsBackdrop, Kicker } from '../../lib/shorts';
import { TerminalWindow, TermLine } from '../../lib/terminal';
import { VO } from './vo.gen';

export const compositionConfig = {
  id: 'PostgresIndexBattle',
  durationInSeconds: 35,
  fps: 30,
  width: 1080,
  height: 1920,
};

const BOX = { x: 58, y: 380, w: 964, h: 980 };
const TERM = { fontSize: 26, lineH: 42, pad: 28, title: 'pg-index-btree-vs-hash — zsh', promptPath: 'app' } as const;

const SESSION: TermLine[] = [
  {
    "kind": "cmd",
    "text": "CREATE INDEX idx_users_email ON users(email);",
    "at": 90,
    "type": true
  },
  {
    "kind": "ok",
    "text": "CREATE INDEX",
    "at": 120
  },
  {
    "kind": "cmd",
    "text": "CREATE INDEX idx_users_email_hash ON users USING HASH (email);",
    "at": 210,
    "type": true
  },
  {
    "kind": "ok",
    "text": "CREATE INDEX",
    "at": 240
  },
  {
    "kind": "cmd",
    "text": "EXPLAIN ANALYZE SELECT * FROM users WHERE email='alice@example.com';",
    "at": 540,
    "type": true
  },
  {
    "kind": "out",
    "text": "Seq Scan on users  (cost=0.00..1.02 rows=1 width=...)",
    "at": 570
  },
  {
    "kind": "out",
    "text": "Index Scan using idx_users_email on users  (cost=0.15..0.30 rows=1 width=...)",
    "at": 600
  },
  {
    "kind": "out",
    "text": "Hash Index Scan using idx_users_email_hash on users  (cost=0.10..0.20 rows=1 width=...)",
    "at": 630
  },
  {
    "kind": "out",
    "text": "Actual time=0.005..0.005 rows=1 loops=1",
    "at": 660
  }
];

export const PostgresIndexBattle: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      <ShortsBackdrop />
      <Kicker text="HOOK" color="#f5d76e" y={90} />
      <BigTitle
        lines={[
          { text: "PostgreSQL Indexing: B-Tree vs...", color: '#f5d76e' },
          { text: "Explained in 35 seconds" }
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

export default PostgresIndexBattle;
