/**
 * Caption Generator Module
 * Generates human-toned, high-engagement Instagram captions with length and hashtag rotation.
 * Powered by Groq models (qwen/qwen3.8-27b, openai/gpt-oss-120b).
 * Enforces anti-bot validation checks (no AI buzzwords, question present, hook under 125 chars).
 */

require('dotenv').config();
const Groq = require('groq-sdk');

// 10 slots per week rotation: Short -> Long -> Medium -> Short...
const CAPTION_LENGTH_SEQUENCE = [
  'short', 'long', 'medium', 'short', 'long',
  'medium', 'short', 'long', 'medium', 'short'
];

const AI_WORDS_BLACKLIST = [
  'seamless', 'empower', 'leverage', 'dive in',
  'game changer', 'unlock', 'discover', 'elevate',
  'timeless wisdom', 'young minds', 'crafted for',
  'delve', 'testament', 'revolutionize', 'in conclusion'
];

const CAPTION_SYSTEM_PROMPT = `You are a human Instagram creator who writes captions that feel personal and get high engagement. You NEVER sound like AI. You vary your writing style each time.

Rules:
- Write in first person, conversational tone
- First line is the hook — must appear before 'more' (under 125 characters)
- Include 1 personal or relatable observation
- End with a genuine question to trigger comments
- Do NOT use: 'seamless', 'empower', 'leverage', 'dive in', 'game changer', 'unlock', 'discover', 'elevate'
- Output caption text only, no labels, no quotes`;

/**
 * Validates caption against anti-bot and SEO quality rules
 */
function validateCaption(caption) {
  if (!caption || typeof caption !== 'string') {
    throw new Error('Caption must be a non-empty string');
  }

  const lower = caption.toLowerCase();
  const matchedWord = AI_WORDS_BLACKLIST.find((w) => lower.includes(w));
  if (matchedWord) {
    throw new Error(`Caption contains AI-sounding word: "${matchedWord}"`);
  }

  if (!caption.includes('?')) {
    throw new Error('Caption missing question for engagement');
  }

  const lines = caption.split('\n').filter((l) => l.trim().length > 0);
  const firstLine = lines[0] || '';
  if (firstLine.length > 125) {
    throw new Error(`First line too long (${firstLine.length} chars, max 125 permitted)`);
  }

  return true;
}

/**
 * Calls Groq for caption generation with candidate model fallback
 */
async function callGroqCaption(systemPrompt, userPrompt) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    throw new Error('GROQ_API_KEY is missing in .env');
  }

  const groq = new Groq({ apiKey: groqKey });
  const candidateModels = [
    process.env.GROQ_MODEL,
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
  ].filter(Boolean);

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        temperature: 0.75,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      const choice = completion.choices[0]?.message;
      const text = (choice?.content || choice?.reasoning || '').trim();
      if (text.length > 0) {
        return text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[CaptionGenerator] Groq model ${model} failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw lastError || new Error('All Groq caption generation attempts failed');
}

/**
 * Generates an Instagram caption and validates it
 * @param {object} params
 * @param {string} params.category
 * @param {string} params.topic
 * @param {string} params.hook
 * @param {string} params.captionLength - 'short' | 'medium' | 'long'
 * @param {string} params.hashtagSet
 * @returns {Promise<string>}
 */
async function generateCaption({ category, topic, hook, captionLength = 'medium', hashtagSet = '' }) {
  const lengthGuide = {
    short: '2–3 lines + hashtags',
    medium: '4–5 lines + hashtags',
    long: '6–8 lines + hashtags',
  }[captionLength] || '4–5 lines + hashtags';

  const userPrompt = `Category: ${category}
Topic: ${topic}
Script hook: ${hook}
Caption length this post: ${captionLength} (${lengthGuide})
Hashtag set: ${hashtagSet}

Write the Instagram caption. Remember:
- First line must be under 120 characters and end with a line break
- End with a question for the comments
- Append the hashtags at the end separated by a blank line`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      let caption = await callGroqCaption(CAPTION_SYSTEM_PROMPT, userPrompt);

      // Clean wrapping quotes or markdown backticks if returned
      caption = caption.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
      caption = caption.replace(/^["']|["']$/g, '').trim();

      // Ensure hashtags are attached if missing
      if (hashtagSet && !caption.includes('#')) {
        caption = `${caption}\n\n${hashtagSet}`;
      }

      validateCaption(caption);
      return caption;
    } catch (err) {
      console.warn(`[CaptionGenerator] Groq attempt ${attempts} failed: ${err.message}`);
      if (attempts >= maxAttempts) {
        console.warn('[CaptionGenerator] 3 attempts failed. Using fallback evergreen caption.');
        const fallbackHook = hook.length > 120 ? hook.slice(0, 115) + '...' : hook;
        return `${fallbackHook}\n\nHere is what everyone should keep in mind about ${category}.\nWhat are your thoughts on this?\n\n${hashtagSet}`;
      }
    }
  }
}

module.exports = {
  generateCaption,
  validateCaption,
  CAPTION_LENGTH_SEQUENCE,
  AI_WORDS_BLACKLIST,
};
