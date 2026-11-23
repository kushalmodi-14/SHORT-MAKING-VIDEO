/**
 * Test Video Renderer with Remotion + FFmpeg
 */

const { renderVideo } = require('../modules/video-renderer');

async function testRender() {
  console.log('[TestRender] Starting test render for Format A...');
  const script = {
    category: 'gold',
    topic: 'MCX Gold Morning Update',
    hook: 'Gold Rates Dropped ₹600 Today',
    points: [
      'MCX 24K gold opened down 0.4% this morning',
      'Dollar index rebound puts pressure on bullion',
      'Analysts recommend accumulating near 72,000 support',
    ],
    cta: 'Are you buying or waiting for a bigger dip?',
  };

  // Test with short 5s duration for fast verification
  const videoPath = await renderVideo({
    script,
    format: 'A',
    duration: 5,
    slot: 2,
  });

  console.log('[TestRender] Rendered video successfully at:', videoPath);
}

testRender().catch((err) => {
  console.error('[TestRender] Failed:', err);
  process.exit(1);
});
