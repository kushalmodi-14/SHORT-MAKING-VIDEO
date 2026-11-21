import dotenv from 'dotenv';
dotenv.config();
import { generateBeats } from '../lib/chains/scriptChain.js';
import { generateTsx } from '../lib/chains/tsxChain.js';

console.log('Testing generateTsx with openai/gpt-oss-120b...');
try {
  const beats = await generateBeats('Redis caching in Node.js');
  const tsx = await generateTsx(beats);
  console.log('TSX generated length:', tsx.length);
  console.log('First 300 chars:');
  console.log(tsx.slice(0, 300));
} catch (e) {
  console.error('generateTsx failed:', e);
}
