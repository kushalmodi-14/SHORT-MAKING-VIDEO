import dotenv from 'dotenv';
dotenv.config();
import { generateBeats } from '../lib/chains/scriptChain.js';
import { generateTsx } from '../lib/chains/tsxChain.js';

console.log('Testing generateBeats on a health topic...');
try {
  const beats = await generateBeats('Why cold showers spike dopamine for hours');
  console.log('Beats generated:', beats.id, beats.composition, 'niche:', beats.niche);
  const tsx = await generateTsx(beats);
  console.log('TSX generated length:', tsx.length);
  console.log('SUCCESS!');
} catch (e) {
  console.error('FAILED:', e);
}
