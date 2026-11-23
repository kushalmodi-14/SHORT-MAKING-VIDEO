/**
 * Script Generator Module
 * Generates punchy, viral Instagram Reel scripts tailored to Format A or Format B.
 * Powered by Groq models (qwen/qwen3.8-27b, openai/gpt-oss-120b).
 */

require('dotenv').config();
const Groq = require('groq-sdk');
const { CATEGORIES } = require('../config/categories');

const SCRIPT_SYSTEM_PROMPT = `You are a viral Instagram Reels scriptwriter. Your scripts are punchy, human, and built for maximum watch time and shares. You write for Format A (info cards) or Format B (chat style) depending on the category.

Rules:
- Never use corporate or AI-sounding language
- Every script must have a hook in the first 2 seconds
- Scripts must feel like a smart friend explaining something, not a news anchor
- Include a question or CTA at the end for comments
- Format A must have 3-4 bullet points
- Format B must include chat_messages array alternating between personas
- Output ONLY valid JSON, no markdown backticks, no extra text`;

/**
 * Calls Groq API with robust model fallback
 */
async function callGroq(systemPrompt, userPrompt) {
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
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      const choice = completion.choices[0]?.message;
      const text = choice?.content || choice?.reasoning;
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[ScriptGenerator] Groq model ${model} attempt failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw lastError || new Error('All Groq model attempts failed');
}

/**
 * Extracts and parses JSON from LLM response safely
 */
function parseScriptJson(rawText) {
  let clean = rawText.trim();
  // Extract json block if surrounded by markdown or commentary
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }

  const data = JSON.parse(clean);

  if (!data.hook || !Array.isArray(data.points) || !data.cta) {
    throw new Error('Script JSON missing required fields (hook, points, cta)');
  }

  return {
    hook: String(data.hook).trim(),
    points: data.points.map((p) => String(p).trim()),
    cta: String(data.cta).trim(),
    estimated_duration_sec: Number(data.estimated_duration_sec) || 30,
    chat_messages: Array.isArray(data.chat_messages) ? data.chat_messages : undefined,
  };
}

/**
 * Generates script with up to 3 retries using Groq
 * @param {object} params
 * @param {string} params.category
 * @param {string} params.topic
 * @param {string} params.format - 'A' or 'B'
 * @param {number} params.duration - 15, 30, or 60
 * @returns {Promise<object>}
 */
async function generateScript({ category, topic, format = 'A', duration = 30 }) {
  const catInfo = CATEGORIES[category] || { audience: 'General curious audience' };
  const userPrompt = `Category: ${category}
Topic: ${topic}
Format: ${format === 'A' ? 'Format A (animated info cards)' : 'Format B (chat dialogue)'}
Duration: ${duration} seconds
Audience: ${catInfo.audience}

Generate a reel script. Output ONLY valid JSON:
{
  "hook": "first 2-second hook line",
  "points": ["point 1", "point 2", "point 3"],
  "cta": "question for comments",
  "estimated_duration_sec": ${duration}${format === 'B' ? ',\n  "chat_messages": [{"sender": "AI Expert", "text": "message 1"}, {"sender": "You", "text": "message 2"}]' : ''}
}`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const raw = await callGroq(SCRIPT_SYSTEM_PROMPT, userPrompt);
      const script = parseScriptJson(raw);
      script.format = format;
      script.category = category;
      script.topic = topic;

      // Ensure chat messages exist for Format B
      if (format === 'B' && (!script.chat_messages || !script.chat_messages.length)) {
        script.chat_messages = [
          { sender: 'AI Expert', text: script.hook },
          { sender: 'You', text: 'Wait, really? Tell me more!' },
          ...script.points.map((pt, idx) => ({
            sender: idx % 2 === 0 ? 'AI Expert' : 'You',
            text: pt,
          })),
          { sender: 'AI Expert', text: script.cta },
        ];
      }

      return script;
    } catch (err) {
      console.warn(`[ScriptGenerator] Groq attempt ${attempts} failed: ${err.message}`);
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate valid script via Groq after 3 attempts: ${err.message}`);
      }
    }
  }
}

module.exports = {
  generateScript,
  parseScriptJson,
  SCRIPT_SYSTEM_PROMPT,
};
