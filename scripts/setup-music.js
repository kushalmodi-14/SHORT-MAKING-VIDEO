const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const musicDir = path.resolve(__dirname, '..', 'assets', 'music');
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });

const moods = {
  ambient_lofi: [220, 246.94, 277.18, 329.63, 370],
  lofi_beats: [130.81, 146.83, 164.81, 196, 220],
  devotional_bg: [293.66, 329.63, 369.99, 440, 493.88],
  upbeat: [261.63, 293.66, 329.63, 392, 440]
};

// Check if we can reuse existing clips or synthesize
const existingClipsDir = path.resolve(__dirname, '..', 'media', 'library', 'music', 'clips');
const existingClips = fs.existsSync(existingClipsDir) ? fs.readdirSync(existingClipsDir).filter(f => f.endsWith('.mp3')) : [];

for (const [mood, freqs] of Object.entries(moods)) {
  for (let i = 1; i <= 5; i++) {
    const filename = path.join(musicDir, `${mood}_${i}.mp3`);
    if (!fs.existsSync(filename)) {
      if (existingClips.length >= i && mood === 'ambient_lofi') {
        fs.copyFileSync(path.join(existingClipsDir, existingClips[i - 1]), filename);
        console.log(`Copied clip to ${path.basename(filename)}`);
      } else {
        const f = freqs[(i - 1) % freqs.length];
        const cmd = `ffmpeg -f lavfi -i "sine=frequency=${f}:duration=60" -af "volume=0.2,lowpass=f=1200,afade=t=in:ss=0:d=2,afade=t=out:st=58:d=2" -y "${filename}"`;
        try {
          execSync(cmd, { stdio: 'ignore' });
          console.log(`Generated ${path.basename(filename)}`);
        } catch (err) {
          console.error(`Error generating ${filename}:`, err.message);
        }
      }
    }
  }
}
console.log('Music assets ready in assets/music');
