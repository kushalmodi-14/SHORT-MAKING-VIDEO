import dotenv from 'dotenv';
dotenv.config();
import { generateBeats } from '../lib/chains/scriptChain.js';

console.log('Testing generateBeats with openai/gpt-oss-120b...');
try {
  const beats = await generateBeats('Redis caching in Node.js');
  console.log('Beats generated successfully:', beats.id, beats.composition, beats.title);
  console.log('VO lines count:', beats.vo.length);
  console.log('Sample VO:', beats.vo[0]);
} catch (e) {
  console.error('generateBeats failed:', e);
}
