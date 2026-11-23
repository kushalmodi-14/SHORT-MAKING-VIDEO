/**
 * Comprehensive Test Suite for Instagram Reel Automation System
 * Verifies Duration Manager, Hashtag Manager, Caption Validator,
 * Trend Detector, Script Generator (Groq), and Caption Generator (Groq).
 */

const assert = require('assert');
const { getDurationForSlot, DURATION_SEQUENCE } = require('../modules/duration-manager');
const { getHashtagSet, getISOWeekNumber } = require('../modules/hashtag-manager');
const { validateCaption, AI_WORDS_BLACKLIST } = require('../modules/caption-generator');
const { detectTrend } = require('../modules/trend-detector');
const { generateScript } = require('../modules/script-generator');
const { generateCaption } = require('../modules/caption-generator');

async function runTests() {
  console.log('--- TEST 1: Duration Rotation Manager ---');
  for (let i = 0; i < DURATION_SEQUENCE.length - 1; i++) {
    const cur = getDurationForSlot(i);
    const next = getDurationForSlot(i + 1);
    assert.notStrictEqual(cur, next, `Slot ${i} (${cur}s) and Slot ${i+1} (${next}s) must not have identical duration`);
  }
  console.log('✓ Duration sequence validated: no consecutive duplicate durations.');

  console.log('\n--- TEST 2: Hashtag Rotation Manager ---');
  const week1 = getHashtagSet('gold', 1);
  const week2 = getHashtagSet('gold', 2);
  const week3 = getHashtagSet('gold', 3);
  assert.ok(week1.includes('#gold'), 'Week 1 gold hashtag set valid');
  assert.notStrictEqual(week1, week2, 'Week 1 and Week 2 hashtag sets must rotate');
  assert.notStrictEqual(week2, week3, 'Week 2 and Week 3 hashtag sets must rotate');
  console.log('✓ Hashtag rotation validated across weeks 1, 2, and 3.');

  console.log('\n--- TEST 3: Caption Validation (Anti-bot rules) ---');
  // Valid caption
  const validCap = 'Gold rates just dipped ₹600 in Mumbai today.\nHere is what you should check before buying this week.\nWould you buy now or wait?\n\n#goldrate #goldtoday';
  assert.strictEqual(validateCaption(validCap), true, 'Valid caption should pass');

  // Should fail on missing question
  assert.throws(() => {
    validateCaption('Gold rates dropped today. Buy now.\n\n#gold');
  }, /missing question/, 'Should fail without question mark');

  // Should fail on AI buzzwords
  assert.throws(() => {
    validateCaption('A seamless game changer for your wealth?\n\n#gold');
  }, /contains AI-sounding word/, 'Should fail on AI blacklist words');

  // Should fail on long first line hook (> 125 chars)
  const longHook = 'This is an extremely long first line that exceeds one hundred and twenty five characters by a very large margin and will definitely get cut off by Instagram more button?';
  assert.throws(() => {
    validateCaption(`${longHook}\nWhat do you think?`);
  }, /First line too long/, 'Should fail if first line > 125 chars');
  console.log('✓ Caption anti-bot validation rules passed.');

  console.log('\n--- TEST 4: Trend Detection Safety & Fallback ---');
  const trendResult = await detectTrend('gold');
  assert.ok(typeof trendResult === 'string' && trendResult.length > 5, 'detectTrend must return valid string');
  console.log(`✓ Trend detection returned: "${trendResult}"`);

  console.log('\n--- TEST 5: Groq Script Generation ---');
  const testScript = await generateScript({
    category: 'gold',
    topic: 'MCX Gold rates morning update',
    format: 'A',
    duration: 30,
  });
  assert.ok(testScript.hook, 'Script must have hook');
  assert.ok(Array.isArray(testScript.points) && testScript.points.length >= 2, 'Script must have at least 2 points');
  assert.ok(testScript.cta, 'Script must have cta');
  console.log(`✓ Groq generated script successfully:`);
  console.log(`  Hook: "${testScript.hook}"`);
  console.log(`  Points: ${JSON.stringify(testScript.points)}`);
  console.log(`  CTA: "${testScript.cta}"`);

  console.log('\n--- TEST 6: Groq Caption Generation ---');
  const testCaption = await generateCaption({
    category: 'gold',
    topic: 'MCX Gold rates morning update',
    hook: testScript.hook,
    captionLength: 'short',
    hashtagSet: '#gold #mcx',
  });
  assert.ok(typeof testCaption === 'string' && testCaption.length > 20, 'Caption generated');
  console.log('✓ Groq generated validated caption:');
  console.log('----------------------------------------------------');
  console.log(testCaption);
  console.log('----------------------------------------------------');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
