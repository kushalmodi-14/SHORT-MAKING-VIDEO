/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@remotion/bundler',
    '@remotion/renderer',
    '@remotion/studio',
    '@remotion/studio-shared',
    '@remotion/google-fonts',
    '@remotion/paths',
    'remotion',
    '@sparticuz/chromium',
    'ffmpeg-static',
  ],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './remotion-build/**/*',
      './remotion/**/*',
    ],
  },
};

module.exports = nextConfig;
