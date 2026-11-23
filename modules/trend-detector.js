/**
 * Trend Detector Module
 * Queries RSS feeds, Reddit endpoints, and Google Trends to discover and score
 * rising topics for the 9 reel categories.
 */

const Parser = require('rss-parser');
const axios = require('axios');
let googleTrends;
try {
  googleTrends = require('google-trends-api');
} catch {
  googleTrends = null;
}
const { EVERGREEN_TOPICS } = require('../config/evergreen-topics');

const rssParser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'ReelBot/1.0' },
});

const RSS_FEEDS = {
  news: 'https://feeds.bbci.co.uk/news/rss.xml',
  india: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  gold: 'https://economictimes.indiatimes.com/markets/commodities/rss',
  world: 'https://feeds.reuters.com/reuters/worldNews',
  sports: 'https://feeds.bbci.co.uk/sport/rss.xml',
};

const REDDIT_ENDPOINTS = {
  india: 'https://www.reddit.com/r/india/hot.json?limit=10',
  worldnews: 'https://www.reddit.com/r/worldnews/hot.json?limit=10',
  cricket: 'https://www.reddit.com/r/cricket/hot.json?limit=10',
  gold: 'https://www.reddit.com/r/Gold/hot.json?limit=5',
  podcasts: 'https://www.reddit.com/r/podcasts/hot.json?limit=10',
};

const CATEGORY_SOURCES = {
  news: { rss: RSS_FEEDS.news, reddit: REDDIT_ENDPOINTS.india, search: 'India news today' },
  gold: { rss: RSS_FEEDS.gold, reddit: REDDIT_ENDPOINTS.gold, search: 'Gold rate India' },
  war: { rss: RSS_FEEDS.world, reddit: REDDIT_ENDPOINTS.worldnews, search: 'World conflict geopolitical' },
  educational: { rss: RSS_FEEDS.news, reddit: REDDIT_ENDPOINTS.india, search: 'Science discovery breakthrough' },
  motivation: { rss: null, reddit: REDDIT_ENDPOINTS.india, search: 'Motivation success discipline' },
  spiritual: { rss: null, reddit: null, search: 'Bhagavad Gita Krishna Mahabharat' },
  sports: { rss: RSS_FEEDS.sports, reddit: REDDIT_ENDPOINTS.cricket, search: 'Cricket India fitness match' },
  comedy: { rss: null, reddit: REDDIT_ENDPOINTS.india, search: 'Trending meme humor India' },
  podcast: { rss: null, reddit: REDDIT_ENDPOINTS.podcasts, search: 'Viral podcast mindset interview' },
};

/**
 * Calculates freshness score 0-100 based on published date
 */
function calculateFreshness(isoDateStr) {
  if (!isoDateStr) return 20;
  const pubTime = new Date(isoDateStr).getTime();
  const diffHours = (Date.now() - pubTime) / (1000 * 60 * 60);
  if (diffHours < 1) return 100;
  if (diffHours < 6) return 70;
  if (diffHours < 24) return 40;
  return 10;
}

/**
 * Fetches RSS feed items safely
 */
async function fetchRssItems(url) {
  if (!url) return [];
  try {
    const feed = await rssParser.parseURL(url);
    return (feed.items || []).slice(0, 5).map((item) => ({
      title: (item.title || '').trim(),
      date: item.pubDate || item.isoDate,
      freshness: calculateFreshness(item.pubDate || item.isoDate),
    }));
  } catch (err) {
    return [];
  }
}

/**
 * Fetches Reddit topics safely
 */
async function fetchRedditItems(url) {
  if (!url) return [];
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'ReelBot/1.0' },
      timeout: 6000,
    });
    const posts = res.data?.data?.children || [];
    return posts.slice(0, 5).map((p) => ({
      title: (p.data?.title || '').trim(),
      score: Math.min(100, Math.round(((p.data?.score || 0) / 500) * 100)),
    }));
  } catch (err) {
    return [];
  }
}

/**
 * Fetches Google Trends interest score
 */
async function fetchTrendsScore(keyword) {
  if (!googleTrends || !keyword) return 50;
  try {
    const results = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });
    const parsed = JSON.parse(results);
    const timeline = parsed?.default?.timelineData || [];
    if (!timeline.length) return 50;
    const latest = timeline[timeline.length - 1];
    return latest.value?.[0] || 50;
  } catch (err) {
    return 50;
  }
}

/**
 * Detects the highest-scoring trend for a category.
 * If score < 30 or upon any network failure, returns the evergreen topic.
 * @param {string} category
 * @returns {Promise<string>}
 */
async function detectTrend(category) {
  const evergreen = EVERGREEN_TOPICS[category] || 'Top insights you need to know today';
  const config = CATEGORY_SOURCES[category];
  if (!config) return evergreen;

  try {
    const [rssItems, redditItems, trendsScore] = await Promise.all([
      fetchRssItems(config.rss),
      fetchRedditItems(config.reddit),
      fetchTrendsScore(config.search),
    ]);

    const candidates = [];

    for (const r of rssItems) {
      if (r.title.length > 10) {
        // trendScore = (googleTrendsScore * 0.4) + (rssFreshness * 0.3) + (redditUpvotes * 0.2) + (newsApiCount * 0.1)
        const score = (trendsScore * 0.4) + (r.freshness * 0.3) + (30 * 0.2) + 5;
        candidates.push({ topic: r.title, score });
      }
    }

    for (const p of redditItems) {
      if (p.title.length > 10) {
        const score = (trendsScore * 0.4) + (40 * 0.3) + (p.score * 0.2) + 5;
        candidates.push({ topic: p.title, score });
      }
    }

    if (candidates.length === 0) {
      return evergreen;
    }

    candidates.sort((a, b) => b.score - a.score);
    const topCandidate = candidates[0];

    if (topCandidate.score < 30) {
      return evergreen;
    }

    // Clean up title
    let cleanTopic = topCandidate.topic.replace(/[-|][^-\|]+$/, '').trim();
    if (cleanTopic.length > 100) {
      cleanTopic = cleanTopic.slice(0, 97) + '...';
    }

    return cleanTopic || evergreen;
  } catch (err) {
    console.warn(`[TrendDetector] Error detecting trend for ${category}, falling back to evergreen:`, err.message);
    return evergreen;
  }
}

module.exports = {
  detectTrend,
  calculateFreshness,
  fetchRssItems,
  fetchRedditItems,
  fetchTrendsScore,
};
