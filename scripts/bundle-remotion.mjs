import { bundle } from '@remotion/bundler';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('[bundle-remotion] Pre-bundling Remotion composition for production...');
  const entryPoint = path.resolve(process.cwd(), 'remotion', 'src', 'index.ts');
  const outDir = path.resolve(process.cwd(), 'remotion-build');

  if (!fs.existsSync(entryPoint)) {
    throw new Error(`Entry point not found: ${entryPoint}`);
  }

  const serveUrl = await bundle({
    entryPoint,
    outDir,
    enableCaching: false,
  });

  console.log(`[bundle-remotion] Successfully bundled to: ${serveUrl}`);
}

main().catch((err) => {
  console.error('[bundle-remotion] Bundle failed:', err);
  process.exit(1);
});
