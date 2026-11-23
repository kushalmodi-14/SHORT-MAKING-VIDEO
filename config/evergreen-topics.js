/**
 * Fallback evergreen topics per category.
 * Used when trend score < 30 or when news feeds are temporarily unavailable.
 */

const EVERGREEN_TOPICS = {
  motivation:  'Why 99% of people never reach their goals',
  gold:        'Should you buy gold today? 3 things to check first',
  news:        '5 things happening in India this week',
  educational: 'Did you know this about the human brain?',
  spiritual:   'What the Bhagavad Gita says about fear',
  war:         'The 3 biggest geopolitical flashpoints right now',
  sports:      '3 fitness habits that elite athletes swear by',
  comedy:      'Things every Indian can relate to',
  podcast:     'The one mindset shift that changes everything',
};

module.exports = {
  EVERGREEN_TOPICS,
};
