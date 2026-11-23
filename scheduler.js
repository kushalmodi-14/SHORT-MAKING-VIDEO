/**
 * Master Scheduler for Instagram Reel Automation System
 * Schedules 10 algorithmically timed weekly reels + Sunday token refresh.
 * All cron expressions configured in UTC (IST = UTC + 5:30).
 *
 * Includes built-in Account Warm-up mode:
 * - WARMUP_STAGE=1 (Weeks 1-2): 3 posts/week (Mon, Wed, Fri)
 * - WARMUP_STAGE=2 (Weeks 3-4): 7 posts/week
 * - WARMUP_STAGE=3 / default: Full 10 posts/week
 */

const cron = require('node-cron');
const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { runPipeline } = require('./pipeline');
const { refreshToken } = require('./modules/token-manager');
const { generateWeeklySummary } = require('./scripts/generate-weekly-summary');

// Start lightweight static file server to serve public/reels over HTTP
const staticPort = parseInt(process.env.PORT || '3000', 10);
const publicRoot = path.resolve(__dirname, 'public');

let lastDetectedHost = null;

const server = http.createServer((req, res) => {
  // Automatically capture host and protocol from incoming requests
  if (req.headers.host) {
    const proto = req.headers['x-forwarded-proto'] || 'http';
    lastDetectedHost = `${proto}://${req.headers.host}`;
    process.env.DETECTED_HOST = lastDetectedHost;
  }

  const safePath = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(publicRoot, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const stat = fs.statSync(filePath);
    const contentType = filePath.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';

    // Support HTTP range requests (required by Meta video crawler)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': contentType,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[Scheduler] Port ${staticPort} already in use (e.g. Next.js). Using existing server for public files.`);
  } else {
    console.warn(`[Scheduler] Static server notice: ${err.message}`);
  }
});

server.listen(staticPort, () => {
  console.log(`[Scheduler] Static file server listening at http://localhost:${staticPort} serving ${publicRoot}`);
});

const warmupStage = parseInt(process.env.WARMUP_STAGE || '3', 10);
console.log(`[Scheduler] Initializing ReelBot Scheduler (Warmup Stage: ${warmupStage})`);

/**
 * Checks if a slot should run under the current warm-up policy
 */
function shouldRunSlot(slot) {
  if (warmupStage === 1) {
    // Stage 1: Slots 0 (Mon), 2 (Wed), 4 (Fri) only
    return [0, 2, 4].includes(slot);
  }
  if (warmupStage === 2) {
    // Stage 2: 7 reels/week (skip slots 6, 8, 9)
    return ![6, 8, 9].includes(slot);
  }
  // Stage 3: Full 10 slots
  return true;
}

// Reel 1 — Monday: Motivation — 6:00 AM IST = 00:30 UTC
if (shouldRunSlot(0)) {
  cron.schedule('30 0 * * 1', () => {
    console.log('[Scheduler] Triggering Slot 0 (Monday - Motivation)');
    runPipeline({ slot: 0, category: 'motivation', format: 'B', duration: 30 });
  });
}

// Reel 2 — Tuesday: News — 7:00 AM IST = 01:30 UTC
if (shouldRunSlot(1)) {
  cron.schedule('30 1 * * 2', () => {
    console.log('[Scheduler] Triggering Slot 1 (Tuesday - News)');
    runPipeline({ slot: 1, category: 'news', format: 'A', duration: 15 });
  });
}

// Reel 3 — Wednesday: Gold Rate — 9:00 AM IST = 03:30 UTC
if (shouldRunSlot(2)) {
  cron.schedule('30 3 * * 3', () => {
    console.log('[Scheduler] Triggering Slot 2 (Wednesday - Gold Rate)');
    runPipeline({ slot: 2, category: 'gold', format: 'A', duration: 60 });
  });
}

// Reel 4 — Thursday: Educational — 2:00 PM IST = 08:30 UTC
if (shouldRunSlot(3)) {
  cron.schedule('30 8 * * 4', () => {
    console.log('[Scheduler] Triggering Slot 3 (Thursday - Educational)');
    runPipeline({ slot: 3, category: 'educational', format: 'A', duration: 30 });
  });
}

// Reel 5 — Friday: Comedy — 6:00 PM IST = 12:30 UTC
if (shouldRunSlot(4)) {
  cron.schedule('30 12 * * 5', () => {
    console.log('[Scheduler] Triggering Slot 4 (Friday - Comedy)');
    runPipeline({ slot: 4, category: 'comedy', format: 'B', duration: 15 });
  });
}

// Reel 6 — Saturday: Spiritual — 6:00 AM IST = 00:30 UTC
if (shouldRunSlot(5)) {
  cron.schedule('30 0 * * 6', () => {
    console.log('[Scheduler] Triggering Slot 5 (Saturday - Spiritual)');
    runPipeline({ slot: 5, category: 'spiritual', format: 'B', duration: 60 });
  });
}

// Reel 7 — Saturday: War/Geo — 4:00 PM IST = 10:30 UTC (6hr gap from Reel 6)
if (shouldRunSlot(6)) {
  cron.schedule('30 10 * * 6', () => {
    console.log('[Scheduler] Triggering Slot 6 (Saturday - War/Geopolitical)');
    runPipeline({ slot: 6, category: 'war', format: 'A', duration: 30 });
  });
}

// Reel 8 — Sunday: Spiritual (2nd) — 6:30 AM IST = 01:00 UTC
if (shouldRunSlot(7)) {
  cron.schedule('0 1 * * 0', () => {
    console.log('[Scheduler] Triggering Slot 7 (Sunday - Spiritual 2nd)');
    runPipeline({ slot: 7, category: 'spiritual', format: 'A', duration: 15 });
  });
}

// Reel 9 — Sunday: Sports — 11:00 AM IST = 05:30 UTC (4.5hr gap from Reel 8)
if (shouldRunSlot(8)) {
  cron.schedule('30 5 * * 0', () => {
    console.log('[Scheduler] Triggering Slot 8 (Sunday - Sports/Fitness)');
    runPipeline({ slot: 8, category: 'sports', format: 'B', duration: 60 });
  });
}

// Reel 10 — Sunday: Podcast — 7:00 PM IST = 13:30 UTC (8hr gap from Reel 9)
if (shouldRunSlot(9)) {
  cron.schedule('30 13 * * 0', () => {
    console.log('[Scheduler] Triggering Slot 9 (Sunday - Podcast/Interview)');
    runPipeline({ slot: 9, category: 'podcast', format: 'B', duration: 30 });
  });
}

// Sunday Token Refresh — 11:00 PM IST = 17:30 UTC
cron.schedule('30 17 * * 0', async () => {
  console.log('[Scheduler] Running weekly Instagram token refresh...');
  try {
    await refreshToken();
  } catch (err) {
    console.error('[Scheduler] Weekly token refresh failed:', err.message);
  }
});

// Sunday Weekly Summary Log — 11:45 PM IST = 18:15 UTC
cron.schedule('15 18 * * 0', () => {
  console.log('[Scheduler] Generating weekly performance summary...');
  try {
    generateWeeklySummary();
  } catch (err) {
    console.error('[Scheduler] Failed to generate weekly summary:', err.message);
  }
});

console.log('[Scheduler] ReelBot scheduler active. Waiting for next cron trigger...');
