/**
 * Weekly Summary Generator
 * Reads logs/posts.log and logs/errors.log to generate an aggregate weekly report
 * written to logs/weekly-summary.log.
 */

const fs = require('fs');
const path = require('path');

function generateWeeklySummary() {
  const logsDir = path.resolve(__dirname, '..', 'logs');
  const postsLog = path.join(logsDir, 'posts.log');
  const errorsLog = path.join(logsDir, 'errors.log');
  const summaryLog = path.join(logsDir, 'weekly-summary.log');

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  let totalPosts = 0;
  let categoryCounts = {};
  if (fs.existsSync(postsLog)) {
    const lines = fs.readFileSync(postsLog, 'utf8').trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (new Date(item.timestamp).getTime() >= oneWeekAgo) {
          totalPosts++;
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        }
      } catch {}
    }
  }

  let totalErrors = 0;
  if (fs.existsSync(errorsLog)) {
    const lines = fs.readFileSync(errorsLog, 'utf8').trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (new Date(item.timestamp).getTime() >= oneWeekAgo) {
          totalErrors++;
        }
      } catch {}
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    period: 'Past 7 Days',
    successfulPosts: totalPosts,
    errorsEncountered: totalErrors,
    postsByCategory: categoryCounts,
  };

  fs.appendFileSync(summaryLog, JSON.stringify(summary, null, 2) + '\n---\n', 'utf8');
  console.log('[WeeklySummary] Report written to logs/weekly-summary.log:', summary);
  return summary;
}

if (require.main === module) {
  generateWeeklySummary();
}

module.exports = {
  generateWeeklySummary,
};
