import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('Testing openai/gpt-oss-120b on Groq...');

try {
  const res = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: 'You are a helpful assistant. Output valid JSON only.' },
      { role: 'user', content: 'Output a JSON object with key "status" set to "ready".' },
    ],
    response_format: { type: 'json_object' },
  });
  console.log('SUCCESS:', res.choices[0].message.content);
} catch (err) {
  console.error('ERROR:', err);
}
