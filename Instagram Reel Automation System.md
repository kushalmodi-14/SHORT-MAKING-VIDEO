# Instagram Reel Automation System

Nov 22, 2026 · @Kushal

## Executive Summary

This system autonomously generates, optimises, and publishes 10 Instagram Reels per week across 9 content categories — with zero manual intervention. It detects trending topics in real time, generates AI video content, writes human-toned captions with rotating hashtag sets, and posts at algorithmically optimal IST times. The only recurring cost is the Claude API, estimated at ₹8–10 per month.

**Core principle:** The system mimics human posting behaviour at every layer — varied caption length, varied reel duration, varied hashtag sets, and timed gaps between posts — to avoid Meta's bot-detection systems.

## Business Overview and Goals

The system serves a solo creator (hobby project) who wants a fully autonomous Instagram presence across multiple high-engagement content verticals. No video production skills, no manual scheduling, and no daily involvement are required after initial setup.

**Primary goals:**

- Build an audience of 10,000+ followers within 6 months through consistent, algorithm-optimised posting
- Generate content across 9 categories to maximise audience diversity and reduce ban risk
- Keep total monthly cost under ₹500
- Achieve a share rate and save rate that signal quality content to Meta's algorithm

**Success metrics:**

| Metric | Target |
| --- | --- |
| Reels posted per week | 10 |
| Average watch time | >50% of reel length |
| Share rate | >2% of views |
| Save rate | >1% of views |
| Monthly follower growth | +500 minimum |
| Account warnings from Meta | 0 |

**Anti-ban commitment:** Every technical decision in this system prioritises account safety. The system behaves like a thoughtful human creator, not a bot.

## Content Strategy — Categories, Audiences and Timing

The weekly schedule runs 10 reels across 9 categories. Spiritual/Devotional posts twice because it is the highest-shared category for the Indian audience and the two slots target distinct moments (personal Saturday reflection vs family Sunday sharing). No other category repeats.

### Anti-repetition rules

- Never post 2 reels within 3 hours on the same day
- Minimum gap between same-day posts: 4–6 hours
- Rotate caption length: short (2 lines), medium (4 lines), long (6 lines) — never the same length twice in a row
- Rotate reel duration: 15 sec, 30 sec, 60 sec — same duration posted consecutively = bot signal
- Rotate hashtag sets: 3 pre-built sets per category, cycled weekly — never copy-paste identical hashtags

### Weekly schedule

| Day | Reel # | Category | Post time (IST) | Primary audience | Key engagement signal |
| --- | --- | --- | --- | --- | --- |
| Monday | 1 | Motivation / Self-improvement | 6:00–7:30 AM | Age 18–35, global | Share rate |
| Tuesday | 2 | News / Current affairs | 7:00–8:30 AM | Age 22–45, educated | Forward to WhatsApp |
| Wednesday | 3 | Gold Rate / Finance | 9:00–10:00 AM | Age 25–50, investors | Save rate |
| Thursday | 4 | Educational / How-to | 2:00–4:00 PM | Age 18–35, students | Save rate |
| Friday | 5 | Comedy / Entertainment | 6:00–8:00 PM | Age 15–30, global | Share rate |
| Saturday | 6 | Spiritual / Devotional | 6:00–7:00 AM | Age 25–60, India | Share to family |
| Saturday | 7 | War / Geopolitical | 4:00–6:00 PM | Age 22–45, global | Comment rate |
| Sunday | 8 | Spiritual / Devotional (2nd) | 6:30–8:00 AM | Age 25–60, India | Share to family |
| Sunday | 9 | Sports / Fitness | 11:00 AM–1:00 PM | Age 16–35 | Rewatch rate |
| Sunday | 10 | Podcast clip / Interview | 7:00–9:00 PM | Age 22–45 | Save + share |

### Timing rationale by category

**Motivation (Monday 6 AM IST):** Monday morning is the highest motivation-seeking moment globally. People mentally prepare for the week. Share rate is 2–3× higher than any other day.

**News (Tuesday 7 AM IST):** Midweek news engagement peaks Tuesday–Wednesday when people are fully in work mode. Morning = news-checking habit time.

**Gold Rate (Wednesday 9 AM IST):** Indian market opens at 9 AM IST (MCX). Gold buyers and investors check rates at market open. Wednesday posts get the highest saves of the week for finance content.

**Educational (Thursday 2 PM IST):** Thursday is peak learning day globally. Mid-afternoon = break time for students and professionals. Save rate for educational content is the highest of all categories.

**Comedy (Friday 6 PM IST):** Friday evening = weekend headspace. Highest comedy engagement day. People are relaxed and share funny content to friends.

**Spiritual Saturday (6 AM IST):** Saturday morning spiritual content is the highest-performing time slot in India. People share with family on WhatsApp heavily.

**War/Geopolitical (Saturday 4 PM IST):** Saturday afternoon = time to consume serious long-form content. Comment rate is very high — debate signals high engagement to algorithm.

**Spiritual Sunday (6:30 AM IST):** Sunday morning is the single biggest spiritual content moment of the week. Temple visits, prayer routines, family time = peak sharing.

**Sports/Fitness (Sunday 11 AM IST):** Post-workout Sunday scrolling. People finished morning exercise and are in an active mindset.

**Podcast/Interview (Sunday 7 PM IST):** Sunday evening = reflective, intellectual mood. People planning their week are receptive to thoughtful content.

## Video Types, Formats and Prompts

The system uses two primary visual formats that are fully automatable with Remotion + FFmpeg. Each category maps to a format and ships with ready-to-use AI prompts for script generation, video generation, and caption generation.

### Format A — Animated Info Card

Text-based cards appear one by one on a dark gradient background. No characters or faces. Fast-moving text = high rewatch rate. Easiest to automate.

**Best for:** Gold Rate, News, Educational, War/Geopolitical, Motivation

**Remotion layout:**

- Background: dark gradient (deep purple, navy, or near-black)
- Category tag pill at top
- Bold headline (large, centred)
- 3–4 numbered bullet points appearing with stagger animation (each delayed 600ms)
- Source attribution at bottom
- Background music: low, ambient
- Duration: 30–45 sec

**Reel duration variation rule (PINNED — MUST IMPLEMENT):** Same duration posted consecutively is a confirmed bot signal to Meta's algorithm. The scheduler must rotate: 15 sec → 30 sec → 60 sec → 15 sec. Never generate the same duration twice in a row regardless of category.

---

### Format B — Fake Chat / Conversation Style

Simulated chat bubbles between two parties ("You" and an AI or expert persona). Information is revealed conversationally. People rewatch because the conversation moves fast and they miss lines.

**Best for:** Comedy, Podcast clips, Sports, Spiritual, Entertainment

**Remotion layout:**

- Background: near-black
- Left bubble (AI/Expert): dark card, white text
- Right bubble (User): accent colour (purple or teal)
- Bubbles appear sequentially with 800ms delay
- Typing indicator between messages
- Background music: subtle lo-fi beat
- Duration: 20–40 sec

---

### Claude API Prompts by Category

These are the system prompts sent to the Claude API for each content generation step.

#### Prompt 1 — Script Generation (sent first, before video render)

```
SYSTEM:
You are a viral Instagram Reels scriptwriter. Your scripts are punchy, human, and built for maximum watch time and shares. You write for Format A (info cards) or Format B (chat style) depending on the category.

Rules:
- Never use corporate or AI-sounding language
- Every script must have a hook in the first 2 seconds
- Scripts must feel like a smart friend explaining something, not a news anchor
- Include a question or CTA at the end for comments
- Output ONLY valid JSON, no extra text

USER:
Category: {category}
Topic: {trending_topic}
Format: {format_A_or_B}
Duration: {15|30|60} seconds
Audience: {audience_description}

Generate a reel script. Output as JSON:
{
  "hook": "first 2-second line",
  "points": ["point 1", "point 2", "point 3"],
  "cta": "question for comments",
  "estimated_duration_sec": 30
}
```

#### Prompt 2 — Caption Generation (sent after script, before posting)

```
SYSTEM:
You are a human Instagram creator who writes captions that feel personal and get high engagement. You NEVER sound like AI. You vary your writing style each time.

Rules:
- Write in first person, conversational tone
- First line is the hook — must appear before 'more' (under 125 characters)
- Include 1 personal or relatable observation
- End with a genuine question to trigger comments
- Do NOT use: 'seamless', 'empower', 'leverage', 'dive in', 'game changer'
- Output caption text only, no labels

Caption length this post: {short|medium|long} (rotate each post)
- Short: 2–3 lines + hashtags
- Medium: 4–5 lines + hashtags
- Long: 6–8 lines + hashtags

USER:
Category: {category}
Topic: {topic}
Script hook: {hook_from_script}
Hashtag set: {hashtag_set_1|2|3} (rotate weekly)

Write the Instagram caption.
```

#### Prompt 3 — Hashtag Sets (pre-generated, rotated weekly)

Each category has 3 hashtag sets. The scheduler rotates Set 1 → Set 2 → Set 3 → Set 1. Never use the same set two weeks running.

**Gold Rate — Set 1:** `#goldrate #goldpriceindia #sonekarate #mcxgold #goldtoday #goldmarket #indiangold #goldbuyers #goldprice2026 #commoditymarket`

**Gold Rate — Set 2:** `#aajkasonekabhav #goldrateindia #goldtrading #mcxlive #goldnews #bullion #goldpricetoday #goldinvestment #sona #rateofdayindia`

**Gold Rate — Set 3:** `#goldpriceupdate #gold24k #goldmarket2026 #goldpricedrop #goldpricerise #mcxcommodity #indiagold #goldinvesting #goldwatch #ratealert`

**News — Set 1:** `#breakingnews #latestnews #newsindia #todaynews #currentaffairs #indiatv #newsupdate #worldnews #livenews #newsreel`

**News — Set 2:** `#indiaupdates #aajkikhaber #newstoday #trending #viralvideo #newsflash #todayheadlines #indiannews #worldaffairs #reelsnews`

**News — Set 3:** `#topnews #headlinestoday #newshighlights #dailynews #newssummary #latestupdates #newsinshort #instaknowledge #informative #knowledgeable`

**Motivation — Set 1:** `#motivation #mondaymotivation #mindset #success #hustle #selfimprovement #growthmindset #dailymotivation #inspire #motivationalquotes`

**Motivation — Set 2:** `#nevergiveup #successmindset #goalsetting #discipline #hardwork #consistency #motivateyourself #positivevibes #workout #personaldevelopment`

**Motivation — Set 3:** `#mondaymorning #weeklygoals #startstrong #believeinyourself #achieveyourgoals #motivationmonday #mindsetmatters #levelup #grindset #keepgoing`

**Spiritual — Set 1:** `#mahabharat #bhagavadgita #spirituality #hindudharma #sanatan #krishna #devotional #bhajan #spiritualawakening #indianculture`

**Spiritual — Set 2:** `#mahabharatstories #hindumythology #dharma #arjuna #vedic #spiritualcontent #bhakti #hinduism #sanatandharma #godquotes`

**Spiritual — Set 3:** `#mahabharatquotes #krishnaconsciousness #spiritualreels #hinduwisdom #ancientwisdom #vedicknowledge #dharmiclife #bhagwatgeeta #templevibes #spiritualjourney`

**War/Geopolitical — Set 1:** `#geopolitics #worldnews #warupdate #globalaffairs #internationalnews #worldaffairs #geopoliticalanalysis #conflictnews #currentevents #breakingnews`

**Educational — Set 1:** `#didyouknow #learneveryday #knowledgeispower #factsoftheday #interestingfacts #educationalcontent #learningisfun #mindblowing #education #informative`

**Sports/Fitness — Set 1:** `#fitness #workout #gym #fitnessmotivation #sports #cricket #ipl #fitlife #bodybuilding #sportsnews`

**Comedy/Entertainment — Set 1:** `#funny #comedy #reels #trending #viral #fun #memes #indiancomedy #entertainmentreels #lol`

**Podcast/Interview — Set 1:** `#podcast #podcastclips #interview #interestingconversation #knowledgepodcast #podcastindia #learnfromothers #insightful #thoughtleadership #mindexpanding`

---

### Video Generation Prompts (Remotion/FFmpeg)

These are the template parameters sent to Remotion's render API to generate the final MP4.

#### Format A — Info Card Remotion Props

```json
{
  "template": "info_card",
  "theme": "dark_gradient",
  "accent_color": "#7C3AED",
  "category_tag": "{category}",
  "headline": "{script.hook}",
  "points": "{script.points}",
  "source_text": "{source_name} · {today_date}",
  "background_music": "ambient_lo_fi_{random_1_to_5}.mp3",
  "duration_sec": "{15|30|60}",
  "fps": 30,
  "resolution": "1080x1920",
  "stagger_delay_ms": 600,
  "font": "Inter"
}
```

#### Format B — Chat Style Remotion Props

```json
{
  "template": "chat_conversation",
  "background": "#0A0A0A",
  "bubble_left_color": "#1E1E2E",
  "bubble_right_color": "#7C3AED",
  "persona_left": "AI Expert",
  "persona_right": "You",
  "messages": "{script.chat_messages}",
  "typing_delay_ms": 800,
  "background_music": "lofi_beats_{random_1_to_5}.mp3",
  "duration_sec": "{15|30|60}",
  "fps": 30,
  "resolution": "1080x1920"
}
```

## Reel SEO and Anti-Ban Rules

### Reel SEO — Algorithm Signals (ranked by impact)

| Signal | Impact | Implementation |
| --- | --- | --- |
| Watch time and replays | Highest | Hook in first 1–2 sec; cut slow intros |
| Shares and saves | Highest | End every reel with save/share CTA |
| Caption keywords | Very high | Natural keyword sentences, not just hashtags |
| On-screen text / subtitles | Very high | Auto-subtitles always enabled; edit to include keywords |
| Hashtags (3-tier mix) | High | Niche 10K–100K + Mid 100K–1M + Large 1M+ |
| Comments (first 60 min) | Medium-high | End reel with question; reply to every comment in first hour |
| Trending audio | Medium | Check Instagram's Trending section before each post |
| Profile keyword match | Medium | Instagram bio and name contain niche keywords |

### Caption SEO rules

- First 125 characters = the hook (shown before 'more')
- Write topic keywords naturally in a sentence — not just in hashtags
- Example: `Today's gold rate dropped ₹800 — here's what it means for buyers this week.`
- Always end with a question: `Which city has the best gold rates? Drop your city below 👇`

### Anti-ban rules (PINNED — CRITICAL)

Meta's algorithm detects automated accounts using pattern analysis. The following rules are non-negotiable and must be enforced at the code level:

1. **Duration variation:** Rotate reel lengths — 15 sec, 30 sec, 60 sec. Never post the same duration consecutively.
2. **Caption length variation:** Rotate short (2–3 lines), medium (4–5 lines), long (6–8 lines). Never repeat the same length in consecutive posts.
3. **Hashtag rotation:** Use 3 pre-built hashtag sets per category. Rotate weekly. Never copy-paste identical hashtags across posts.
4. **Post gap enforcement:** Minimum 4–6 hours between same-day posts. Never post 2 reels within 3 hours.
5. **Human-tone captions:** Claude API generates fresh captions every time. Never use templates with only variable substitution.
6. **Account warm-up:** For new accounts, start at 3 reels/week for the first 2 weeks, increase to 7 for weeks 3–4, then 10 from week 5 onward.
7. **No third-party scheduling apps:** Post directly via Instagram Graph API only. Third-party schedulers increase ban risk.
8. **Error handling:** If a post fails, wait 30 minutes before retrying. Never retry immediately — rapid API calls trigger rate-limit flags.

## Trend Detection System

The trend detector runs before every scheduled post to identify the most relevant and rising topic for that category. It queries four free data sources and scores each topic. The highest-scoring topic is passed to the script generator.

### Data sources

| Source | What it provides | API key needed? | Refresh rate |
| --- | --- | --- | --- |
| Google Trends (unofficial) | Rising search interest score 0–100 | No | Every few hours |
| RSS feeds (BBC, Reuters, ET) | Breaking headlines and article summaries | No | Every 15 minutes |
| Reddit .json endpoint | Top community discussions by subreddit | No (User-Agent header only) | Real-time |
| NewsAPI.org | Structured headlines by keyword | Yes (free: 100 req/day) | Every hour |

### Source-to-category mapping

| Category | Primary source | Fallback source | Key search terms |
| --- | --- | --- | --- |
| News | RSS (BBC + Reuters) | NewsAPI | `india news today` |
| Gold Rate | RSS (Economic Times) | Google Trends | `gold rate india`, `MCX gold` |
| War/Geopolitical | RSS (Reuters World) | Reddit r/worldnews | `war`, `conflict`, `geopolitical` |
| Educational | Google Trends | Reddit r/india | category topic |
| Motivation | Google Trends | Static (Monday always works) | `motivation monday` |
| Spiritual | Static schedule | Google Trends | Mahabharat, Krishna |
| Sports/Fitness | RSS (Sports) | Reddit r/cricket | `IPL`, `cricket`, `fitness` |
| Comedy | Google Trends | Reddit r/india | `trending meme india` |
| Podcast | Google Trends | Reddit r/podcasts | `podcast clip viral` |

### Scoring algorithm

```
trendScore = (googleTrendsScore × 0.4) + (rssFreshness × 0.3) + (redditUpvotes × 0.2) + (newsApiCount × 0.1)
```

- `googleTrendsScore`: 0–100 interest score from pytrends
- `rssFreshness`: 100 if published <1hr ago, 70 if <6hr, 40 if <24hr, 0 if older
- `redditUpvotes`: normalised 0–100 based on top post upvotes in relevant subreddit
- `newsApiCount`: number of articles on topic in last 24hr, capped and normalised to 0–100

The topic with the highest `trendScore` is selected. If no topic scores above 30, the system falls back to a pre-defined evergreen topic for that category.

### RSS feed URLs

```js
const RSS_FEEDS = {
  news:    'https://feeds.bbci.co.uk/news/rss.xml',
  india:   'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  gold:    'https://economictimes.indiatimes.com/markets/commodities/rss',
  world:   'https://feeds.reuters.com/reuters/worldNews',
  sports:  'https://feeds.bbci.co.uk/sport/rss.xml',
};
```

### Reddit endpoints (no auth)

```js
const REDDIT_ENDPOINTS = {
  india:     'https://www.reddit.com/r/india/hot.json?limit=10',
  worldnews: 'https://www.reddit.com/r/worldnews/hot.json?limit=10',
  cricket:   'https://www.reddit.com/r/cricket/hot.json?limit=10',
  gold:      'https://www.reddit.com/r/Gold/hot.json?limit=5',
};
// Always send: headers: { 'User-Agent': 'ReelBot/1.0' }
```

### Evergreen fallback topics per category

```js
const EVERGREEN_TOPICS = {
  motivation:  'Why 99% of people never reach their goals',
  gold:        'Should you buy gold today? 3 things to check first',
  news:        '5 things happening in India this week',
  educational: 'Did you know this about the human brain?',
  spiritual:   'What the Bhagavad Gita says about fear',
  war:         'The 3 biggest geopolitical flashpoints right now',
  sports:      '3 fitness habits that elite athletes swear by',
  comedy:      'Things every Indian can relate to',
  podcast:     'The one mindset shift that changes everything',
};
```

## AI Video Generation Pipeline

The video pipeline takes a generated script and renders a final 1080×1920 MP4 reel ready for Instagram posting. It runs entirely on the Oracle Cloud free server.

### Pipeline steps

```
1. Script JSON received from Claude API
       ↓
2. Remotion renders animated React component → raw video frames
       ↓
3. FFmpeg:
   a. Encodes frames to H.264 MP4
   b. Adds background music (from /assets/music/)
   c. Burns in subtitles (SRT file from script points)
   d. Sets duration to scheduled value (15/30/60 sec)
   e. Applies slight film grain (removes AI-smoothness look)
       ↓
4. Output: /tmp/reels/{date}_{category}_{duration}sec.mp4
       ↓
5. File passed to Instagram poster module
       ↓
6. File deleted after confirmed post
```

### Remotion setup

```bash
npm install remotion @remotion/renderer
# Install Chrome for headless rendering
npx remotion lambda sites create  # or local render
```

### FFmpeg commands

```bash
# Step 1: Encode Remotion output + add music
ffmpeg -i remotion_output.mp4 \
  -i assets/music/ambient_lofi_${RANDOM_TRACK}.mp3 \
  -c:v libx264 -preset fast -crf 23 \
  -c:a aac -b:a 128k \
  -shortest \
  -vf "scale=1080:1920" \
  with_music.mp4

# Step 2: Add film grain (anti-AI-smooth signal)
ffmpeg -i with_music.mp4 \
  -vf "noise=alls=4:allf=t+u" \
  -c:a copy \
  final_reel.mp4

# Step 3: Burn subtitles (optional, improves watch time)
ffmpeg -i final_reel.mp4 \
  -vf subtitles=script.srt \
  -c:a copy \
  final_reel_subbed.mp4
```

### Duration rotation enforcement

```js
// duration-manager.js
const DURATION_SEQUENCE = [30, 15, 60, 30, 15, 60, 30, 15, 60, 30]; // 10 reels/week
// Index matches weekly reel slot 0–9
// Never generate same duration twice in a row

function getDurationForSlot(slotIndex) {
  return DURATION_SEQUENCE[slotIndex % DURATION_SEQUENCE.length];
}
```

### Music assets

Store 5 tracks per mood in `/assets/music/`. All tracks must be royalty-free (sources: Pixabay Music, Free Music Archive, YouTube Audio Library).

```
/assets/music/
  ambient_lofi_1.mp3 … ambient_lofi_5.mp3   (info card format)
  lofi_beats_1.mp3 … lofi_beats_5.mp3       (chat format)
  devotional_bg_1.mp3 … devotional_bg_5.mp3 (spiritual category)
  upbeat_1.mp3 … upbeat_5.mp3               (motivation/sports)
```

Track selection is random within the category's mood group on each render. Never reuse the same track in consecutive posts.

## Caption and Hashtag Generation

### Caption generation flow

The caption generator is called after the script is confirmed and before the video is posted. It uses the Claude API with a strict system prompt to produce human-toned, varied captions.

```js
// caption-generator.js
async function generateCaption({ category, topic, hook, captionLength, hashtagSet }) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: CAPTION_SYSTEM_PROMPT,  // see Section 4, Prompt 2
    messages: [{
      role: 'user',
      content: `Category: ${category}\nTopic: ${topic}\nHook: ${hook}\nCaption length: ${captionLength}\nHashtag set: ${hashtagSet}`
    }]
  });
  return response.content[0].text;
}
```

### Caption length rotation

```js
// Must rotate across consecutive posts — never repeat same length twice in a row
const CAPTION_LENGTH_SEQUENCE = [
  'short', 'long', 'medium', 'short', 'long',
  'medium', 'short', 'long', 'medium', 'short'
]; // 10 slots per week
```

### Hashtag set rotation

```js
// hashtag-manager.js
// Each category has 3 sets. Week number determines which set to use.
function getHashtagSet(category, weekNumber) {
  const setIndex = (weekNumber % 3) + 1; // Returns 1, 2, or 3
  return HASHTAG_SETS[category][`set_${setIndex}`];
}
// weekNumber = ISO week number of current date
```

### Caption quality checks (automated)

Before posting, run these regex/string checks on the generated caption:

```js
const AI_WORDS_BLACKLIST = [
  'seamless', 'empower', 'leverage', 'dive in',
  'game changer', 'unlock', 'discover', 'elevate',
  'timeless wisdom', 'young minds', 'crafted for'
];

function validateCaption(caption) {
  const hasAIWords = AI_WORDS_BLACKLIST.some(w => caption.toLowerCase().includes(w));
  const hasQuestion = caption.includes('?');
  const firstLineLength = caption.split('\n')[0].length;
  const hookUnder125Chars = firstLineLength <= 125;

  if (hasAIWords) throw new Error('Caption contains AI-sounding words — regenerate');
  if (!hasQuestion) throw new Error('Caption missing question for engagement');
  if (!hookUnder125Chars) throw new Error('First line too long — will be cut by Instagram');

  return true;
}
```

If validation fails, the caption is regenerated automatically. Maximum 3 retries. If all 3 fail, use the evergreen fallback caption for that category.

## Instagram API and Token Management

### Setup steps

1. Create Meta Developer account at developers.facebook.com
2. Create a Business-type app
3. Add Instagram Graph API product
4. Link Facebook Page to Instagram Professional account (Creator or Business — not personal)
5. Generate short-lived token (valid 1 hour) from API Setup screen
6. Exchange for long-lived token (valid 60 days) via token exchange endpoint
7. Store token in `.env` file on Oracle server
8. Set up weekly auto-refresh cron to keep token alive indefinitely

### Token exchange — short-lived to long-lived

```js
// token-manager.js
async function exchangeForLongLivedToken(shortLivedToken) {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${process.env.META_APP_ID}` +
    `&client_secret=${process.env.META_APP_SECRET}` +
    `&fb_exchange_token=${shortLivedToken}`;

  const res = await fetch(url);
  const data = await res.json();
  // data.access_token = long-lived token (60-day expiry)
  return data.access_token;
}
```

### Auto-refresh (weekly cron — CRITICAL)

Long-lived tokens reset their 60-day timer each time they are used. The weekly refresh cron calls the token endpoint and writes the new token back to `.env`. This keeps the token alive indefinitely without manual renewal.

```js
// Runs every Sunday at 11 PM IST (17:30 UTC)
async function refreshToken() {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${process.env.META_APP_ID}` +
    `&client_secret=${process.env.META_APP_SECRET}` +
    `&fb_exchange_token=${process.env.IG_ACCESS_TOKEN}`;

  const res = await fetch(url);
  const { access_token } = await res.json();

  // Write new token back to .env
  updateEnvFile('IG_ACCESS_TOKEN', access_token);
  console.log(`[TokenRefresh] Token refreshed at ${new Date().toISOString()}`);
}
```

### Reel posting flow

```js
// instagram-poster.js
async function postReel({ videoPath, caption }) {
  // Step 1: Upload video to public URL (Oracle Object Storage or temporary signed URL)
  const videoUrl = await uploadToPublicStorage(videoPath);

  // Step 2: Create media container
  const { data: { id: containerId } } = await axios.post(
    `https://graph.facebook.com/v21.0/${process.env.IG_USER_ID}/media`,
    {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption,
      share_to_feed: true,
    },
    { params: { access_token: process.env.IG_ACCESS_TOKEN } }
  );

  // Step 3: Wait for video processing (poll every 10 sec, max 10 retries)
  await waitForProcessing(containerId);

  // Step 4: Publish
  const { data } = await axios.post(
    `https://graph.facebook.com/v21.0/${process.env.IG_USER_ID}/media_publish`,
    { creation_id: containerId },
    { params: { access_token: process.env.IG_ACCESS_TOKEN } }
  );

  // Step 5: Delete local video file
  fs.unlinkSync(videoPath);

  // Step 6: Log result
  console.log(`[Post] Published reel ID: ${data.id} at ${new Date().toISOString()}`);
  return data.id;
}

async function waitForProcessing(containerId, retries = 10) {
  for (let i = 0; i < retries; i++) {
    await new Promise(r => setTimeout(r, 10000)); // 10 sec
    const { data } = await axios.get(
      `https://graph.facebook.com/v21.0/${containerId}`,
      { params: { fields: 'status_code', access_token: process.env.IG_ACCESS_TOKEN } }
    );
    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') throw new Error('Video processing failed at Meta');
  }
  throw new Error('Video processing timeout — Meta took too long');
}
```

### Environment variables required

```env
IG_USER_ID=your_instagram_user_id
IG_ACCESS_TOKEN=your_long_lived_token
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
ANTHROPIC_API_KEY=your_claude_api_key
NEWS_API_KEY=your_newsapi_org_key
```

### Error handling rules

- If post fails: wait 30 minutes before retry (never immediate retry)
- If token expired: run refresh immediately, then retry post
- If video processing errors: regenerate video and retry within 2 hours
- All errors logged to `/logs/errors.log` with timestamp and category

## Scheduler and Cron Architecture

The scheduler is the master orchestrator. It runs on the Oracle Cloud server as a Node.js process managed by PM2. Each cron job corresponds to one weekly reel slot and triggers the full pipeline — trend detection → script → video → caption → post.

### Cron schedule (all times UTC — IST = UTC + 5:30)

```js
// scheduler.js — using node-cron
import cron from 'node-cron';

// Reel 1 — Monday: Motivation — 6:00 AM IST = 00:30 UTC
cron.schedule('30 0 * * 1', () => runPipeline({ slot: 0, category: 'motivation', format: 'B', duration: 30 }));

// Reel 2 — Tuesday: News — 7:00 AM IST = 01:30 UTC
cron.schedule('30 1 * * 2', () => runPipeline({ slot: 1, category: 'news', format: 'A', duration: 15 }));

// Reel 3 — Wednesday: Gold Rate — 9:00 AM IST = 03:30 UTC
cron.schedule('30 3 * * 3', () => runPipeline({ slot: 2, category: 'gold', format: 'A', duration: 60 }));

// Reel 4 — Thursday: Educational — 2:00 PM IST = 08:30 UTC
cron.schedule('30 8 * * 4', () => runPipeline({ slot: 3, category: 'educational', format: 'A', duration: 30 }));

// Reel 5 — Friday: Comedy — 6:00 PM IST = 12:30 UTC
cron.schedule('30 12 * * 5', () => runPipeline({ slot: 4, category: 'comedy', format: 'B', duration: 15 }));

// Reel 6 — Saturday: Spiritual — 6:00 AM IST = 00:30 UTC
cron.schedule('30 0 * * 6', () => runPipeline({ slot: 5, category: 'spiritual', format: 'B', duration: 60 }));

// Reel 7 — Saturday: War/Geo — 4:00 PM IST = 10:30 UTC (6hr gap from Reel 6)
cron.schedule('30 10 * * 6', () => runPipeline({ slot: 6, category: 'war', format: 'A', duration: 30 }));

// Reel 8 — Sunday: Spiritual (2nd) — 6:30 AM IST = 01:00 UTC
cron.schedule('0 1 * * 0', () => runPipeline({ slot: 7, category: 'spiritual', format: 'A', duration: 15 }));

// Reel 9 — Sunday: Sports — 11:00 AM IST = 05:30 UTC (4.5hr gap from Reel 8)
cron.schedule('30 5 * * 0', () => runPipeline({ slot: 8, category: 'sports', format: 'B', duration: 60 }));

// Reel 10 — Sunday: Podcast — 7:00 PM IST = 13:30 UTC (8hr gap from Reel 9)
cron.schedule('30 13 * * 0', () => runPipeline({ slot: 9, category: 'podcast', format: 'B', duration: 30 }));

// Token refresh — Sunday 11:00 PM IST = 17:30 UTC
cron.schedule('30 17 * * 0', () => refreshToken());
```

### Pipeline orchestrator

```js
// pipeline.js
async function runPipeline({ slot, category, format, duration }) {
  const startTime = new Date();
  console.log(`[Pipeline] Starting slot ${slot} — ${category} — ${duration}sec`);

  try {
    // 1. Detect trending topic
    const topic = await detectTrend(category);
    console.log(`[Trend] Topic selected: ${topic}`);

    // 2. Generate script via Claude API
    const script = await generateScript({ category, topic, format, duration });

    // 3. Render video via Remotion + FFmpeg
    const videoPath = await renderVideo({ script, format, duration, slot });

    // 4. Generate caption + validate
    const captionLength = CAPTION_LENGTH_SEQUENCE[slot];
    const hashtagSet = getHashtagSet(category, getISOWeekNumber());
    const caption = await generateCaption({ category, topic, hook: script.hook, captionLength, hashtagSet });
    validateCaption(caption);

    // 5. Post to Instagram
    const reelId = await postReel({ videoPath, caption });

    // 6. Log success
    logPost({ slot, category, topic, duration, captionLength, reelId, startTime });

  } catch (err) {
    console.error(`[Pipeline ERROR] Slot ${slot} — ${category}:`, err.message);
    logError({ slot, category, error: err.message, timestamp: new Date() });
    // Schedule retry in 30 minutes (anti-ban rule: never immediate retry)
    setTimeout(() => runPipeline({ slot, category, format, duration }), 30 * 60 * 1000);
  }
}
```

### PM2 process management

```bash
# Install PM2
npm install -g pm2

# Start scheduler
pm2 start scheduler.js --name reel-bot

# Auto-restart on server reboot
pm2 startup
pm2 save

# Monitor
pm2 logs reel-bot
pm2 status
```

### Account warm-up schedule (new accounts only)

| Week | Reels per week | Notes |
| --- | --- | --- |
| 1–2 | 3 | Mon, Wed, Fri only |
| 3–4 | 7 | Skip one Sunday slot |
| 5+ | 10 | Full schedule |

Implement warm-up by commenting out cron jobs during weeks 1–4 and uncommenting progressively.

## Infrastructure and Server Setup

### Oracle Cloud Free Tier (recommended)

Oracle Cloud's Always Free tier is the most generous free server in the industry. The ARM Ampere A1 instance is permanently free with no credit card expiry trick.

| Resource | Free allocation |
| --- | --- |
| Instance type | ARM Ampere A1 (4 OCPUs + 24 GB RAM) |
| Storage | 200 GB block storage |
| Outbound data | 10 TB/month |
| Duration | Forever |
| Cost | ₹0 |

### Oracle Cloud setup steps

1. Go to cloud.oracle.com → Create free account
2. Select region: **ap-mumbai-1** (closest to IST timezone, lowest latency)
3. Create Compute Instance → Select **Ampere A1** shape
4. Set OCPU: 4, RAM: 24 GB
5. Download the SSH key pair provided
6. Note the public IP address
7. Connect: `ssh -i your_key.pem ubuntu@your_ip`

### Server software installation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install FFmpeg
sudo apt install -y ffmpeg

# Install Chrome (required by Remotion for headless rendering)
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

# Install PM2
npm install -g pm2

# Install project dependencies
cd /home/ubuntu/reel-bot
npm install
```

### Project folder structure

```
/home/ubuntu/reel-bot/
  .env                      # All secrets — never commit to git
  scheduler.js              # Master cron orchestrator
  pipeline.js               # Full post pipeline
  modules/
    trend-detector.js       # Google Trends + RSS + Reddit scoring
    script-generator.js     # Claude API script generation
    video-renderer.js       # Remotion + FFmpeg render
    caption-generator.js    # Claude API caption generation
    hashtag-manager.js      # 3-set rotation per category
    duration-manager.js     # 15/30/60 sec rotation
    instagram-poster.js     # Graph API post + polling
    token-manager.js        # Token refresh and storage
  remotion/
    src/
      InfoCard.tsx           # Format A component
      ChatConversation.tsx   # Format B component
    remotion.config.ts
  assets/
    music/                  # 20 royalty-free tracks
  logs/
    posts.log               # Successful posts log
    errors.log              # Error log
  config/
    categories.js           # Category definitions + hashtag sets
    evergreen-topics.js     # Fallback topics per category
```

### Monthly cost summary

| Item | Cost |
| --- | --- |
| Oracle Cloud ARM server | ₹0 |
| Instagram Graph API | ₹0 |
| Google Trends (unofficial) | ₹0 |
| RSS feeds | ₹0 |
| Reddit .json endpoint | ₹0 |
| NewsAPI.org (free tier) | ₹0 |
| Claude API (10 scripts + 10 captions/week) | \~₹8–10 |
| Remotion (self-hosted render) | ₹0 |
| FFmpeg | ₹0 |
| **Total** | **\~₹10/month** |

## Weekly Content Calendar

This is the fixed weekly template. The category and timing are fixed; only the topic changes each week based on trend detection.

| Slot | Day | Category | Format | Duration | Post time (IST) | Audience | Key goal |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Monday | Motivation | B — Chat | 30 sec | 6:00 AM | 18–35, global | Shares |
| 2 | Tuesday | News | A — Card | 15 sec | 7:00 AM | 22–45, educated | WhatsApp forwards |
| 3 | Wednesday | Gold Rate | A — Card | 60 sec | 9:00 AM | 25–50, investors | Saves |
| 4 | Thursday | Educational | A — Card | 30 sec | 2:00 PM | 18–35, students | Saves |
| 5 | Friday | Comedy | B — Chat | 15 sec | 6:00 PM | 15–30, global | Shares |
| 6 | Saturday | Spiritual | B — Chat | 60 sec | 6:00 AM | 25–60, India | Family shares |
| 7 | Saturday | War/Geo | A — Card | 30 sec | 4:00 PM | 22–45, global | Comments |
| 8 | Sunday | Spiritual (2nd) | A — Card | 15 sec | 6:30 AM | 25–60, India | Family shares |
| 9 | Sunday | Sports/Fitness | B — Chat | 60 sec | 11:00 AM | 16–35 | Rewatches |
| 10 | Sunday | Podcast/Interview | B — Chat | 30 sec | 7:00 PM | 22–45 | Saves + shares |

### Duration rotation confirmation

Slots 1–10 use durations: 30, 15, 60, 30, 15, 60, 30, 15, 60, 30 — no two consecutive slots share the same duration. This is enforced by `duration-manager.js`.

### Caption length rotation confirmation

Slots 1–10 use lengths: short, long, medium, short, long, medium, short, long, medium, short — no two consecutive posts share the same length.

### Hashtag rotation confirmation

Week 1 → Set 1 for all categories. Week 2 → Set 2. Week 3 → Set 3. Week 4 → Set 1 again. Determined by ISO week number modulo 3.

## Task Breakdown for IDE

Paste this section into your IDE as the prompt. Each task is atomic, testable, and ordered by dependency. Complete each task before starting the next.

---

### Phase 1 — Project setup

- [ ] Initialise Node.js project with `npm init`. Install dependencies: `node-cron`, `axios`, `dotenv`, `rss-parser`, `google-trends-api`, `@anthropic-ai/sdk`, `remotion`, `@remotion/renderer`
- [ ] Create `.env` file with all 6 environment variables listed in Section 9. Add `.env` to `.gitignore`.
- [ ] Create the full folder structure as defined in Section 11 (`modules/`, `remotion/`, `assets/music/`, `logs/`, `config/`)
- [ ] Download 20 royalty-free background music tracks (5 per mood: ambient\_lofi, lofi\_beats, devotional\_bg, upbeat) from Pixabay Music. Place in `/assets/music/` with the naming convention defined in Section 7.

---

### Phase 2 — Configuration

- [ ] Create `config/categories.js`. Export a `CATEGORIES` object with all 9 category definitions: name, format (A or B), audience description, and all 3 hashtag sets as defined in Section 4 Prompt 3.
- [ ] Create `config/evergreen-topics.js`. Export `EVERGREEN_TOPICS` object as defined in Section 6.
- [ ] Create `modules/duration-manager.js`. Export `getDurationForSlot(slotIndex)` using the `DURATION_SEQUENCE` array defined in Section 7.
- [ ] Create `modules/hashtag-manager.js`. Export `getHashtagSet(category, weekNumber)` and a helper `getISOWeekNumber()` that returns the current ISO week number.

---

### Phase 3 — Trend detection

- [ ] Create `modules/trend-detector.js`. Implement `detectTrend(category)` that: (1) fetches the relevant RSS feed using `rss-parser`, (2) calls the Reddit .json endpoint with the correct User-Agent header, (3) queries Google Trends using `google-trends-api` for the category's search terms, and (4) scores each topic using the `trendScore` formula from Section 6. Return the highest-scoring topic string. If no topic scores above 30, return the evergreen fallback.
- [ ] Write unit test for `detectTrend`. Mock all three external sources. Assert that: (a) the highest-scoring topic is returned, (b) the evergreen fallback is returned when all scores are below 30, (c) the function does not throw on network failure.

---

### Phase 4 — Script generation

- [ ] Create `modules/script-generator.js`. Implement `generateScript({ category, topic, format, duration })` that calls the Claude API using the system prompt defined in Section 4 Prompt 1. Parse the JSON response and validate that it contains `hook`, `points`, `cta`, and `estimated_duration_sec`. Throw a typed error if JSON parsing fails.
- [ ] Add retry logic to `generateScript`: if the response is not valid JSON, retry up to 3 times with the same prompt. Log each retry attempt.

---

### Phase 5 — Video rendering

- [ ] Create `remotion/src/InfoCard.tsx` — Format A component. Accept props matching the Format A Remotion props defined in Section 7. Animate each bullet point with a staggered `useCurrentFrame` delay of 600ms. Apply dark gradient background and purple accent colour.
- [ ] Create `remotion/src/ChatConversation.tsx` — Format B component. Accept props matching Format B props. Render left and right chat bubbles appearing sequentially using `useCurrentFrame` with 800ms delay between messages. Include a typing indicator animation.
- [ ] Create `modules/video-renderer.js`. Implement `renderVideo({ script, format, duration, slot })` that: (1) selects the correct Remotion component based on format, (2) maps script fields to component props, (3) calls Remotion's `renderMedia` API to render frames, (4) runs the two FFmpeg commands from Section 7 to encode, add music (random track from category mood group), and apply film grain, (5) returns the output file path.
- [ ] Test `renderVideo` end-to-end with a hardcoded script object. Confirm the output MP4 is 1080×1920, the correct duration, and playable.

---

### Phase 6 — Caption generation

- [ ] Create `modules/caption-generator.js`. Implement `generateCaption({ category, topic, hook, captionLength, hashtagSet })` using the system prompt from Section 4 Prompt 2. The function must call `validateCaption` after generation and auto-retry up to 3 times on validation failure. After 3 failures, throw an error (do not post with an invalid caption).
- [ ] Implement `validateCaption(caption)` as defined in Section 8. Check for AI word blacklist, presence of a question mark, and first-line length under 125 characters.

---

### Phase 7 — Token management

- [ ] Create `modules/token-manager.js`. Implement `exchangeForLongLivedToken(shortLivedToken)` and `refreshToken()` as defined in Section 9. The `refreshToken` function must write the new token back to the `.env` file on disk and reload `process.env.IG_ACCESS_TOKEN` in memory.
- [ ] Run `exchangeForLongLivedToken` manually with a short-lived token generated from the Meta Developer dashboard. Confirm a long-lived token is returned and stored in `.env`.

---

### Phase 8 — Instagram posting

- [ ] Create `modules/instagram-poster.js`. Implement `postReel({ videoPath, caption })` and `waitForProcessing(containerId)` as defined in Section 9. Implement `uploadToPublicStorage(videoPath)` using Oracle Object Storage's pre-authenticated request URL (a temporary public URL valid for 2 hours — sufficient for Meta to fetch the video).
- [ ] Test posting with a real short video file and a test caption. Confirm the reel appears on the Instagram profile. Confirm the local video file is deleted after posting.
- [ ] Implement error handling: if `waitForProcessing` throws, log to `errors.log` and schedule a retry in 30 minutes.

---

### Phase 9 — Pipeline orchestration

- [ ] Create `pipeline.js`. Implement `runPipeline({ slot, category, format, duration })` as defined in Section 10, calling all modules in order: detectTrend → generateScript → renderVideo → generateCaption → validateCaption → postReel → logPost.
- [ ] Implement `logPost({ slot, category, topic, duration, captionLength, reelId, startTime })`. Append a JSON line to `logs/posts.log`.
- [ ] Run the full pipeline manually for one category (e.g. `gold`, slot 2). Confirm a reel is posted to Instagram and logged.

---

### Phase 10 — Scheduler

- [ ] Create `scheduler.js` with all 10 cron jobs and the weekly token refresh job as defined in Section 10. Import and call `runPipeline` with the correct arguments for each slot.
- [ ] For new accounts: comment out 7 of the 10 cron jobs and run only slots 1, 3, 5 (Mon/Wed/Fri) for the first 2 weeks. Uncomment progressively as defined in the warm-up table in Section 10.
- [ ] Deploy to Oracle Cloud server via SCP or git pull. Start with PM2: `pm2 start scheduler.js --name reel-bot`. Run `pm2 startup` and `pm2 save` to auto-start on reboot.
- [ ] Verify PM2 is running: `pm2 status`. Tail logs: `pm2 logs reel-bot`. Monitor the first scheduled post end-to-end on the server.

---

### Phase 11 — Monitoring and maintenance

- [ ] Add a weekly summary log: every Sunday after all posts, write a summary to `logs/weekly-summary.log` with post count, success count, error count, and categories posted.
- [ ] Set up Oracle Cloud monitoring alert: notify (email or webhook) if the server goes down or the reel-bot PM2 process crashes.
- [ ] Review `logs/posts.log` monthly. If any category consistently underperforms (low engagement), update its evergreen topic and hashtag sets in `config/`.
