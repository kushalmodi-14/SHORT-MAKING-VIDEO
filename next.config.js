/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@remotion/bundler',
    '@remotion/renderer',
    '@sparticuz/chromium',
    'ffmpeg-static',
  ],
};

module.exports = nextConfig;
