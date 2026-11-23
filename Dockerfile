FROM node:20-bookworm-slim

# Install system dependencies: Chromium, FFmpeg, fonts, procps
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ffmpeg \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-freefont-ttf \
    fontconfig \
    procps \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    CHROME_BIN=/usr/bin/chromium \
    NODE_ENV=production \
    PORT=7860 \
    HOSTNAME="0.0.0.0"

# Hugging Face Spaces runs as user 1000
RUN useradd -m -u 1000 user
WORKDIR /home/user/app

# Copy package manifests first for caching
COPY --chown=user:user package*.json ./

# Install npm dependencies
RUN npm install --legacy-peer-deps

# Copy application files
COPY --chown=user:user . .

# Ensure directory permissions for generation output
RUN mkdir -p public/videos shorts remotion-build && chown -R user:user /home/user/app

USER user

# Build Remotion composition bundle and Next.js production build
RUN npm run build

EXPOSE 7860

CMD ["npm", "start", "--", "-p", "7860"]
