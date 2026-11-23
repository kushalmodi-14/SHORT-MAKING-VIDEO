/**
 * Hashtag Manager
 * Rotates pre-built hashtag sets (Set 1 -> Set 2 -> Set 3) weekly
 * to avoid copying and pasting identical hashtags across posts.
 */

const { CATEGORIES } = require('../config/categories');

/**
 * Calculates ISO 8601 week number of a given Date (1 to 53)
 * @param {Date} [d=new Date()]
 * @returns {number}
 */
function getISOWeekNumber(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

/**
 * Returns rotating hashtag string for the category based on week number
 * @param {string} category
 * @param {number} [weekNumber]
 * @returns {string}
 */
function getHashtagSet(category, weekNumber) {
  const cat = CATEGORIES[category];
  if (!cat || !cat.hashtagSets) {
    return '#reels #viral #trending #explore #fyp';
  }

  const currentWeek = weekNumber !== undefined ? Number(weekNumber) : getISOWeekNumber();
  // 1, 2, or 3
  const setIndex = (Math.abs(currentWeek) % 3) + 1;
  const setKey = `set_${setIndex}`;

  return cat.hashtagSets[setKey] || cat.hashtagSets.set_1;
}

module.exports = {
  getISOWeekNumber,
  getHashtagSet,
};
