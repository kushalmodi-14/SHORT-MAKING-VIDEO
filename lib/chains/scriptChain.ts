import Groq from 'groq-sdk';
import { BeatsSchema, BeatsJson } from '../types';
import { SHORTS_SYSTEM_PROMPT, GROQ_MODEL } from './prompts';

export async function generateBeats(topic: string, apiKey?: string): Promise<BeatsJson> {
  const rawKey = apiKey || process.env.GROQ_API_KEY || '';
  const key = rawKey.replace(/^["']|["']$/g, '').trim();
  if (!key) {
    throw new Error('GROQ_API_KEY is not set in environment or provided.');
  }

  const groq = new Groq({ apiKey: key });

  const prompt = `Topic: "${topic}".
Generate the complete beats.json contract for a vertical YouTube Short (1080x1920, 30fps, ~35 seconds).
Ensure you provide a valid JSON object matching this exact structure:
{
  "id": "short-example",
  "title": "Title here",
  "composition": "ShortExample",
  "format": { "width": 1080, "height": 1920, "fps": 30, "durationSec": 35 },
  "niche": "terminal",
  "terminalSession": [
    { "kind": "cmd", "text": "command here", "at": 0, "type": true }
  ],
  "vo": [
    { "beat": "hook", "text": "First line of speech", "start": 0.4, "end": 3.8 }
  ],
  "beats": [
    { "id": "hook", "start": 0, "end": 4, "visual": "Description of frame", "kicker": "HOOK" }
  ]
}
Return ONLY valid JSON.`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: SHORTS_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);

  // Validate or coerce with Zod
  const validated = BeatsSchema.parse(parsed);

  // Ensure clean PascalCase for composition ID
  let comp = validated.composition.replace(/[^a-zA-Z0-9]/g, '');
  if (!comp || comp === 'ShortExample' || comp === 'ShortGenerated') {
    const words = topic
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 4)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    comp = (words.join('') || 'Short') + 'Short';
  }
  comp = comp.charAt(0).toUpperCase() + comp.slice(1);
  validated.composition = comp;

  return validated;
}
