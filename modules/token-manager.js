/**
 * Token Manager Module
 * Exchanges short-lived tokens for 60-day long-lived tokens and executes
 * weekly auto-refresh to maintain indefinitely valid Instagram Graph API access.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const envFilePath = path.resolve(__dirname, '..', '.env');

/**
 * Updates a specific key in the .env file
 */
function updateEnvFile(key, value) {
  try {
    let content = '';
    if (fs.existsSync(envFilePath)) {
      content = fs.readFileSync(envFilePath, 'utf8');
    }

    const reg = new RegExp(`^${key}=.*$`, 'm');
    if (reg.test(content)) {
      content = content.replace(reg, `${key}="${value}"`);
    } else {
      content += `\n${key}="${value}"`;
    }

    fs.writeFileSync(envFilePath, content.trim() + '\n', 'utf8');
    process.env[key] = value;
    console.log(`[TokenManager] Successfully updated ${key} in .env`);
  } catch (err) {
    console.error(`[TokenManager] Failed to update ${key} in .env:`, err.message);
  }
}

/**
 * Exchanges a 1-hour short-lived token for a 60-day long-lived token
 * @param {string} shortLivedToken
 * @returns {Promise<string>}
 */
async function exchangeForLongLivedToken(shortLivedToken) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('META_APP_ID and META_APP_SECRET are required in .env');
  }

  const url = `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${encodeURIComponent(appId)}` +
    `&client_secret=${encodeURIComponent(appSecret)}` +
    `&fb_exchange_token=${encodeURIComponent(shortLivedToken)}`;

  const res = await axios.get(url, { timeout: 10000 });
  const data = res.data;
  if (!data.access_token) {
    throw new Error('No access_token returned by Meta token exchange');
  }

  updateEnvFile('IG_ACCESS_TOKEN', data.access_token);
  return data.access_token;
}

/**
 * Weekly refresh function to reset the 60-day expiry timer
 */
async function refreshToken() {
  const currentToken = process.env.IG_ACCESS_TOKEN;
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!currentToken || currentToken.startsWith('your_')) {
    console.warn('[TokenManager] No active IG_ACCESS_TOKEN set in .env. Skipping refresh.');
    return null;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${encodeURIComponent(appId)}` +
      `&client_secret=${encodeURIComponent(appSecret)}` +
      `&fb_exchange_token=${encodeURIComponent(currentToken)}`;

    const res = await axios.get(url, { timeout: 10000 });
    const { access_token } = res.data;

    if (access_token) {
      updateEnvFile('IG_ACCESS_TOKEN', access_token);
      console.log(`[TokenManager] Instagram token refreshed successfully at ${new Date().toISOString()}`);
      return access_token;
    }
  } catch (err) {
    console.error('[TokenManager] Token refresh error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  updateEnvFile,
  exchangeForLongLivedToken,
  refreshToken,
};
