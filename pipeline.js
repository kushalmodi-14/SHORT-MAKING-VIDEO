/**
 * Instagram Reel Master Pipeline
 * Coordinates the full automated lifecycle of a Reel:
 * Trend Detection -> Script Generation (Groq) -> Video Render (Remotion + FFmpeg)
 * -> Caption Generation & Anti-bot Validation -> Instagram Posting -> Logging.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { detectTrend } = require('./modules/trend-detector');
const { generateScript } = require('./modules/script-generator');
const { renderVideo } = require('./modules/video-renderer');
const {
  generateCaption,
  validateCaption,
  CAPTION_LENGTH_SEQUENCE,
} = require('./modules/caption-generator');
const { getHashtagSet, getISOWeekNumber } = require('./modules/hashtag-manager');
const { getDurationForSlot } = require('./modules/duration-manager');
const { postReel } = require('./modules/instagram-poster');
const { CATEGORIES } = require('./config/categories');

const logsDir = path.resolve(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Appends a successful post record to logs/posts.log
 */
function logPost({ slot, category, topic, duration, captionLength, reelId, startTime }) {
  const logFile = path.join(logsDir, 'posts.log');
  const durationMs = Date.now() - startTime.getTime();
  const entry = {
    timestamp: new Date().toISOString(),
    slot,
    category,
    topic,
    duration,
    captionLength,
    reelId,
    processingDurationSec: Math.round(durationMs / 1000),
  };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n', 'utf8');
  console.log(`[Pipeline] Logged success to ${logFile}`);
}

/**
 * Appends an error record to logs/errors.log
 */
function logError({ slot, category, error, timestamp = new Date() }) {
  const errorFile = path.join(logsDir, 'errors.log');
  const entry = {
    timestamp: timestamp.toISOString(),
    slot,
    category,
    error: String(error),
  };
  fs.appendFileSync(errorFile, JSON.stringify(entry) + '\n', 'utf8');
  console.error(`[Pipeline] Logged error to ${errorFile}`);
}

/**
 * Runs the full automated pipeline for a scheduled slot
 * @param {object} params
 * @param {number} params.slot - Slot index (0 to 9)
 * @param {string} params.category - Vertical key (e.g. 'gold', 'news')
 * @param {string} [params.format] - 'A' or 'B'
 * @param {number} [params.duration] - 15, 30, or 60
 * @param {boolean} [params.dryRun=false] - Dry run test mode
 */
async function runPipeline({ slot = 0, category = 'news', format, duration, dryRun = false }) {
  const startTime = new Date();
  const catConfig = CATEGORIES[category] || { format: 'A' };
  const targetFormat = format || catConfig.format || 'A';
  const targetDuration = duration || getDurationForSlot(slot);

  console.log('\n===============================================================');
  console.log(`[Pipeline] STARTING REEL: Slot #${slot} | Category: ${category.toUpperCase()} | Format: ${targetFormat} | Duration: ${targetDuration}s`);
  console.log('===============================================================');

  try {
    // 1. Detect trending topic
    console.log(`[Pipeline] Step 1: Detecting trending topic for ${category}...`);
    const topic = await detectTrend(category);
    console.log(`[Pipeline] Topic selected: "${topic}"`);

    // 2. Generate script via Groq
    console.log(`[Pipeline] Step 2: Generating script with Groq (llama-3.3-70b-versatile)...`);
    const script = await generateScript({
      category,
      topic,
      format: targetFormat,
      duration: targetDuration,
    });
    console.log(`[Pipeline] Script generated. Hook: "${script.hook}" (${script.points.length} points)`);

    // 3. Render video via Remotion + FFmpeg
    console.log(`[Pipeline] Step 3: Rendering 1080x1920 MP4 video...`);
    const videoPath = await renderVideo({
      script,
      format: targetFormat,
      duration: targetDuration,
      slot,
    });
    console.log(`[Pipeline] Video render complete: ${videoPath}`);

    // 4. Generate caption with length & hashtag rotation
    const captionLength = CAPTION_LENGTH_SEQUENCE[slot % CAPTION_LENGTH_SEQUENCE.length];
    const hashtagSet = getHashtagSet(category, getISOWeekNumber());
    console.log(`[Pipeline] Step 4: Generating ${captionLength} caption with weekly hashtag set...`);
    const caption = await generateCaption({
      category,
      topic,
      hook: script.hook,
      captionLength,
      hashtagSet,
    });
    validateCaption(caption);

    // 5. Post to Instagram Graph API
    console.log(`[Pipeline] Step 5: Publishing reel to Instagram...`);
    const reelId = await postReel({
      videoPath,
      caption,
      dryRun,
    });

    // 6. Log success
    logPost({
      slot,
      category,
      topic,
      duration: targetDuration,
      captionLength,
      reelId,
      startTime,
    });

    console.log(`[Pipeline] SUCCESS! Reel #${slot} published with ID: ${reelId}`);
    return { success: true, reelId, topic, videoPath };

  } catch (err) {
    console.error(`[Pipeline ERROR] Slot ${slot} — ${category} failed:`, err.message);
    logError({ slot, category, error: err.message, timestamp: new Date() });

    // Anti-ban rule: Never immediate retry. Schedule retry in 30 minutes if in live mode
    if (!dryRun) {
      console.log(`[Pipeline] Anti-ban rule: scheduling retry in 30 minutes (slot ${slot})...`);
      setTimeout(() => {
        runPipeline({ slot, category, format: targetFormat, duration: targetDuration, dryRun: false });
      }, 30 * 60 * 1000);
    }

    throw err;
  }
}

// Allow direct execution from CLI: `node pipeline.js news 1`
if (require.main === module) {
  const categoryArg = process.argv[2] || 'gold';
  const slotArg = parseInt(process.argv[3] || '2', 10);
  const dryRunArg = process.argv.includes('--dry-run') || true; // default dry-run when called directly

  runPipeline({ slot: slotArg, category: categoryArg, dryRun: dryRunArg })
    .then((res) => console.log('[Pipeline CLI] Completed successfully:', res))
    .catch((err) => {
      console.error('[Pipeline CLI] Error running pipeline:', err.message);
      process.exit(1);
    });
}

module.exports = {
  runPipeline,
  logPost,
  logError,
};
