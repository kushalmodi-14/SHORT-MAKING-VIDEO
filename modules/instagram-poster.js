/**
 * Instagram Poster Module
 * Posts generated Reel MP4s to Instagram Graph API using container flow:
 * Upload -> Create Container -> Wait for processing -> Publish -> Cleanup.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

/**
 * Resolves the public URL for a video stored in public/reels/
 * Auto-detects the host from incoming requests (req.headers.host)
 * or falls back cleanly to local/public address without needing manual config.
 */
async function uploadToPublicStorage(videoPath) {
  const fileName = path.basename(videoPath);
  const publicDir = path.resolve(__dirname, '..', 'public', 'reels');

  // Ensure file exists in public/reels
  const targetPath = path.join(publicDir, fileName);
  if (videoPath !== targetPath && fs.existsSync(videoPath)) {
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.copyFileSync(videoPath, targetPath);
  }

  // Auto-detect host from requests or fall back to localhost
  const host = (process.env.DETECTED_HOST || 'http://localhost:3000').replace(/\/$/, '');
  const publicVideoUrl = `${host}/reels/${encodeURIComponent(fileName)}`;

  console.log(`[InstagramPoster] Video accessible via public folder at: ${publicVideoUrl}`);
  return publicVideoUrl;
}

/**
 * Polls container status until FINISHED or ERROR
 */
async function waitForProcessing(containerId, retries = 12) {
  const token = process.env.IG_ACCESS_TOKEN;

  for (let i = 0; i < retries; i++) {
    await new Promise((r) => setTimeout(r, 10000)); // 10s delay

    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/v21.0/${containerId}`,
        {
          params: {
            fields: 'status_code,status',
            access_token: token,
          },
          timeout: 10000,
        }
      );

      console.log(`[InstagramPoster] Container ${containerId} status: ${data.status_code || data.status}`);

      if (data.status_code === 'FINISHED' || data.status === 'FINISHED') {
        return true;
      }
      if (data.status_code === 'ERROR' || data.status === 'ERROR') {
        throw new Error(`Video processing failed at Meta: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      if (err.message.includes('failed at Meta')) throw err;
      console.warn(`[InstagramPoster] Status poll retry ${i + 1}/${retries}: ${err.message}`);
    }
  }

  throw new Error('Video processing timeout — Meta processing took longer than 2 minutes');
}

/**
 * Posts Reel to Instagram Graph API
 * @param {object} params
 * @param {string} params.videoPath - Absolute path to MP4
 * @param {string} params.caption - Final validated caption
 * @param {boolean} [params.dryRun=false] - If true, simulates post without calling Meta API
 * @returns {Promise<string>} Reel ID
 */
async function postReel({ videoPath, caption, dryRun = false }) {
  const userId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;

  // Check if live credentials exist
  const isMockEnv = !userId || !token || userId === 'your_instagram_user_id' || token.startsWith('your_');

  if (dryRun || isMockEnv) {
    console.log('[InstagramPoster] DRY RUN / MOCK MODE enabled (No active Meta credentials).');
    console.log(`[InstagramPoster] Video file preserved at: ${videoPath}`);
    console.log(`[InstagramPoster] Caption preview:\n---\n${caption}\n---`);
    const mockId = `mock_reel_${Date.now()}`;
    return mockId;
  }

  console.log(`[InstagramPoster] Starting upload of ${path.basename(videoPath)}...`);
  const videoUrl = await uploadToPublicStorage(videoPath);
  console.log(`[InstagramPoster] Video accessible at ${videoUrl}`);

  // Step 2: Create Media Container
  const containerRes = await axios.post(
    `https://graph.facebook.com/v21.0/${userId}/media`,
    {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption,
      share_to_feed: true,
    },
    {
      params: { access_token: token },
      timeout: 15000,
    }
  );

  const containerId = containerRes.data?.id;
  if (!containerId) {
    throw new Error('Failed to create Instagram media container');
  }
  console.log(`[InstagramPoster] Created container ID: ${containerId}`);

  // Step 3: Wait for video encoding
  await waitForProcessing(containerId);

  // Step 4: Publish
  const publishRes = await axios.post(
    `https://graph.facebook.com/v21.0/${userId}/media_publish`,
    { creation_id: containerId },
    {
      params: { access_token: token },
      timeout: 15000,
    }
  );

  const reelId = publishRes.data?.id || containerId;
  console.log(`[InstagramPoster] Published reel ID: ${reelId} at ${new Date().toISOString()}`);

  // Step 5: Delete local file
  try {
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log(`[InstagramPoster] Cleaned up temporary video: ${videoPath}`);
    }
  } catch (cleanErr) {
    console.warn(`[InstagramPoster] Notice: could not remove temporary video:`, cleanErr.message);
  }

  return reelId;
}

module.exports = {
  postReel,
  waitForProcessing,
  uploadToPublicStorage,
};
