/**
 * Video Renderer Module
 * Renders Format A (InfoCard) and Format B (ChatConversation) via Remotion and FFmpeg.
 * Applies background music and anti-AI film grain filter.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { CATEGORIES } = require('../config/categories');

let bundleFn = null;
let renderMediaFn = null;
let selectCompositionFn = null;

try {
  const bundler = require('@remotion/bundler');
  const renderer = require('@remotion/renderer');
  bundleFn = bundler.bundle;
  renderMediaFn = renderer.renderMedia;
  selectCompositionFn = renderer.selectComposition;
} catch (err) {
  console.warn('[VideoRenderer] Remotion programmatic bundler/renderer load notice:', err.message);
}

let cachedBundleUrl = null;

/**
 * Ensures Remotion entrypoint is bundled for rendering
 */
async function getBundleUrl() {
  if (cachedBundleUrl && fs.existsSync(cachedBundleUrl)) {
    return cachedBundleUrl;
  }

  const entryPoint = path.resolve(__dirname, '..', 'remotion', 'src', 'index.ts');
  if (!fs.existsSync(entryPoint)) {
    throw new Error(`Remotion entrypoint not found at: ${entryPoint}`);
  }

  console.log('[VideoRenderer] Bundling Remotion project...');
  cachedBundleUrl = await bundleFn({
    entryPoint,
    enableCaching: true,
  });
  console.log(`[VideoRenderer] Bundle created at: ${cachedBundleUrl}`);
  return cachedBundleUrl;
}

/**
 * Selects a random background music track from assets/music for the category
 */
function pickMusicTrack(category) {
  const cat = CATEGORIES[category];
  const mood = cat?.mood || 'ambient_lofi';
  const musicDir = path.resolve(__dirname, '..', 'assets', 'music');

  const trackNum = Math.floor(Math.random() * 5) + 1;
  const trackPath = path.join(musicDir, `${mood}_${trackNum}.mp3`);

  if (fs.existsSync(trackPath)) {
    return trackPath;
  }

  // Fallback to any mp3 in assets/music
  const allTracks = fs.readdirSync(musicDir).filter((f) => f.endsWith('.mp3'));
  if (allTracks.length > 0) {
    return path.join(musicDir, allTracks[Math.floor(Math.random() * allTracks.length)]);
  }

  return null;
}

/**
 * Renders video via Remotion and applies FFmpeg audio mixing + film grain
 * @param {object} params
 * @param {object} params.script
 * @param {string} params.format - 'A' or 'B'
 * @param {number} params.duration - 15, 30, or 60
 * @param {number} [params.slot=0]
 * @returns {Promise<string>} Path to final rendered MP4
 */
async function renderVideo({ script, format = 'A', duration = 30, slot = 0 }) {
  const category = script.category || 'news';
  const catConfig = CATEGORIES[category] || {};
  const compositionId = format === 'B' ? 'ChatConversation' : 'InfoCard';
  const fps = 30;
  const durationInFrames = Math.max(1, Math.round(duration * fps));

  const outDir = path.resolve(__dirname, '..', 'public', 'reels');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const timestamp = Date.now();
  const rawVideoPath = path.join(outDir, `raw_${timestamp}_${category}_${duration}s.mp4`);
  const finalVideoPath = path.join(outDir, `${new Date().toISOString().split('T')[0]}_slot${slot}_${category}_${duration}sec.mp4`);

  // Prepare input props matching Remotion component
  let inputProps;
  if (format === 'B') {
    inputProps = {
      persona_left: 'AI Expert',
      persona_right: 'You',
      bubble_left_color: '#1E1E2E',
      bubble_right_color: catConfig.accentColor || '#7C3AED',
      duration_sec: duration,
      messages: script.chat_messages || [
        { sender: 'AI Expert', text: script.hook },
        { sender: 'You', text: 'Wait, what happened?' },
        ...(script.points || []).map((pt, i) => ({
          sender: i % 2 === 0 ? 'AI Expert' : 'You',
          text: pt,
        })),
        { sender: 'AI Expert', text: script.cta },
      ],
    };
  } else {
    inputProps = {
      category_tag: (catConfig.name || category).toUpperCase(),
      headline: script.hook,
      points: (script.points || []).slice(0, 4),
      source_text: `${script.topic || catConfig.name} · ${new Date().toLocaleDateString('en-IN')}`,
      accent_color: catConfig.accentColor || '#7C3AED',
      duration_sec: duration,
    };
  }

  console.log(`[VideoRenderer] Rendering Composition: ${compositionId} (${duration}s, ${durationInFrames} frames)...`);

  if (renderMediaFn && bundleFn && selectCompositionFn) {
    // Programmatic Remotion render
    const bundleLocation = await getBundleUrl();
    const composition = await selectCompositionFn({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });

    await renderMediaFn({
      composition: {
        ...composition,
        durationInFrames,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: rawVideoPath,
      inputProps,
      imageFormat: 'jpeg',
    });
  } else {
    // CLI fallback
    const propsJson = JSON.stringify(inputProps).replace(/"/g, '\\"');
    const cliCmd = `npx remotion render remotion/src/index.ts ${compositionId} "${rawVideoPath}" --props="${propsJson}" --duration-in-frames=${durationInFrames}`;
    execSync(cliCmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  }

  if (!fs.existsSync(rawVideoPath)) {
    throw new Error(`Raw render failed: output file not found at ${rawVideoPath}`);
  }

  // FFmpeg Step: Mix music + add film grain (anti-AI signal)
  const musicTrack = pickMusicTrack(category);
  console.log(`[VideoRenderer] Applying audio (${musicTrack ? path.basename(musicTrack) : 'none'}) & film grain...`);

  try {
    if (musicTrack && fs.existsSync(musicTrack)) {
      // Encode with background audio + film grain + 1080x1920 scale
      const ffmpegCmd = `ffmpeg -y -i "${rawVideoPath}" -stream_loop -1 -i "${musicTrack}" ` +
        `-filter_complex "[1:a]volume=0.18,afade=t=in:ss=0:d=1,afade=t=out:st=${Math.max(1, duration - 2)}:d=2[a];[0:v]scale=1080:1920,noise=alls=4:allf=t+u[v]" ` +
        `-map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -t ${duration} "${finalVideoPath}"`;

      execSync(ffmpegCmd, { stdio: 'ignore' });
    } else {
      // Film grain only
      const ffmpegCmd = `ffmpeg -y -i "${rawVideoPath}" -vf "scale=1080:1920,noise=alls=4:allf=t+u" -c:v libx264 -preset fast -crf 23 -t ${duration} "${finalVideoPath}"`;
      execSync(ffmpegCmd, { stdio: 'ignore' });
    }

    // Clean up intermediate raw render
    if (fs.existsSync(rawVideoPath)) {
      fs.unlinkSync(rawVideoPath);
    }

    console.log(`[VideoRenderer] Video successfully generated: ${finalVideoPath}`);
    return finalVideoPath;
  } catch (ffmpegErr) {
    console.warn('[VideoRenderer] FFmpeg post-processing warning:', ffmpegErr.message);
    // If FFmpeg filter complex fails, fallback to rawVideoPath
    return rawVideoPath;
  }
}

module.exports = {
  renderVideo,
  pickMusicTrack,
};
