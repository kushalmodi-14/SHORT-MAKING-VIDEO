/**
 * Category Definitions for Instagram Reel Automation
 * Maps each vertical to its visual format, audience description, engagement goal,
 * and 3 rotating hashtag sets.
 */

const CATEGORIES = {
  motivation: {
    id: 'motivation',
    name: 'Motivation / Self-improvement',
    format: 'B', // Chat style
    duration: 30,
    mood: 'upbeat',
    accentColor: '#3B82F6',
    audience: 'Age 18–35, global, career & fitness oriented, seeking weekly motivation',
    keyGoal: 'Share rate (save to story & forward to friends)',
    hashtagSets: {
      set_1: '#motivation #mondaymotivation #mindset #success #hustle #selfimprovement #growthmindset #dailymotivation #inspire #motivationalquotes',
      set_2: '#nevergiveup #successmindset #goalsetting #discipline #hardwork #consistency #motivateyourself #positivevibes #workout #personaldevelopment',
      set_3: '#mondaymorning #weeklygoals #startstrong #believeinyourself #achieveyourgoals #motivationmonday #mindsetmatters #levelup #grindset #keepgoing',
    },
  },
  news: {
    id: 'news',
    name: 'News / Current affairs',
    format: 'A', // Info card
    duration: 15,
    mood: 'ambient_lofi',
    accentColor: '#EF4444',
    audience: 'Age 22–45, educated professionals, active news consumers',
    keyGoal: 'Forward to WhatsApp & high comment engagement',
    hashtagSets: {
      set_1: '#breakingnews #latestnews #newsindia #todaynews #currentaffairs #indiatv #newsupdate #worldnews #livenews #newsreel',
      set_2: '#indiaupdates #aajkikhaber #newstoday #trending #viralvideo #newsflash #todayheadlines #indiannews #worldaffairs #reelsnews',
      set_3: '#topnews #headlinestoday #newshighlights #dailynews #newssummary #latestupdates #newsinshort #instaknowledge #informative #knowledgeable',
    },
  },
  gold: {
    id: 'gold',
    name: 'Gold Rate / Finance',
    format: 'A', // Info card
    duration: 60,
    mood: 'ambient_lofi',
    accentColor: '#F59E0B',
    audience: 'Age 25–50, Indian retail gold buyers, jewellers, commodity investors',
    keyGoal: 'Save rate (reference for gold buying)',
    hashtagSets: {
      set_1: '#goldrate #goldpriceindia #sonekarate #mcxgold #goldtoday #goldmarket #indiangold #goldbuyers #goldprice2026 #commoditymarket',
      set_2: '#aajkasonekabhav #goldrateindia #goldtrading #mcxlive #goldnews #bullion #goldpricetoday #goldinvestment #sona #rateofdayindia',
      set_3: '#goldpriceupdate #gold24k #goldmarket2026 #goldpricedrop #goldpricerise #mcxcommodity #indiagold #goldinvesting #goldwatch #ratealert',
    },
  },
  educational: {
    id: 'educational',
    name: 'Educational / How-to',
    format: 'A', // Info card
    duration: 30,
    mood: 'ambient_lofi',
    accentColor: '#10B981',
    audience: 'Age 18–35, curious students & lifelong learners',
    keyGoal: 'Save rate (bookmark to learn later)',
    hashtagSets: {
      set_1: '#didyouknow #learneveryday #knowledgeispower #factsoftheday #interestingfacts #educationalcontent #learningisfun #mindblowing #education #informative',
      set_2: '#sciencefacts #dailyknowledge #quickfacts #brainfuel #curiosity #learnsomethingnew #factsdaily #studygram #knowledgehub #mindblown',
      set_3: '#learndaily #factsoftheworld #smartlearning #educateyourself #scienceexplained #intellectual #didyouknowthat #generalknowledge #deepdive #knowledgeboost',
    },
  },
  comedy: {
    id: 'comedy',
    name: 'Comedy / Entertainment',
    format: 'B', // Chat style
    duration: 15,
    mood: 'lofi_beats',
    accentColor: '#EC4899',
    audience: 'Age 15–30, global & Indian youth looking to unwind',
    keyGoal: 'Share rate (DM to friends)',
    hashtagSets: {
      set_1: '#funny #comedy #reels #trending #viral #fun #memes #indiancomedy #entertainmentreels #lol',
      set_2: '#desimemes #relatable #humor #laughoutloud #funnymemes #dailymeme #bakchodi #rofl #hilarious #comedyvideo',
      set_3: '#jokes #funnymoments #standupcomedy #instacomedy #desiromance #indianhumor #viralreels #dankmemes #funnyposts #laughing',
    },
  },
  spiritual: {
    id: 'spiritual',
    name: 'Spiritual / Devotional',
    format: 'B', // Default B, Slot 8 uses A
    duration: 60,
    mood: 'devotional_bg',
    accentColor: '#D97706',
    audience: 'Age 25–60, Indian families, spiritually inclined readers',
    keyGoal: 'Share to family via WhatsApp & Instagram DMs',
    hashtagSets: {
      set_1: '#mahabharat #bhagavadgita #spirituality #hindudharma #sanatan #krishna #devotional #bhajan #spiritualawakening #indianculture',
      set_2: '#mahabharatstories #hindumythology #dharma #arjuna #vedic #spiritualcontent #bhakti #hinduism #sanatandharma #godquotes',
      set_3: '#mahabharatquotes #krishnaconsciousness #spiritualreels #hinduwisdom #ancientwisdom #vedicknowledge #dharmiclife #bhagwatgeeta #templevibes #spiritualjourney',
    },
  },
  war: {
    id: 'war',
    name: 'War / Geopolitical',
    format: 'A', // Info card
    duration: 30,
    mood: 'ambient_lofi',
    accentColor: '#6366F1',
    audience: 'Age 22–45, global affairs enthusiasts, critical thinkers',
    keyGoal: 'Comment rate (debates & differing views)',
    hashtagSets: {
      set_1: '#geopolitics #worldnews #warupdate #globalaffairs #internationalnews #worldaffairs #geopoliticalanalysis #conflictnews #currentevents #breakingnews',
      set_2: '#defense #foreignaffairs #geopolitcsdaily #strategy #worldorder #globalnews #internationalrelations #conflictanalysis #diplomacy #security',
      set_3: '#worldconflicts #geopoliticalshift #globaltension #breakingaffairs #worldpolitics #securitystudies #internationalcrisis #globalreport #geopoliticsnews #foreignpolicy',
    },
  },
  sports: {
    id: 'sports',
    name: 'Sports / Fitness',
    format: 'B', // Chat style
    duration: 60,
    mood: 'upbeat',
    accentColor: '#14B8A6',
    audience: 'Age 16–35, cricket lovers & gym enthusiasts',
    keyGoal: 'Rewatch rate (quick punchy banter)',
    hashtagSets: {
      set_1: '#fitness #workout #gym #fitnessmotivation #sports #cricket #ipl #fitlife #bodybuilding #sportsnews',
      set_2: '#athletes #trainhard #fitfam #sportsupdate #cricketfans #gymlife #endurance #sportshighlights #motivationgym #dailysports',
      set_3: '#athleticperformance #cricketworld #matchday #trainingmotivation #sportsreels #gymgoals #fitnessroutine #peakperformance #sportsanalysis #fitinspiration',
    },
  },
  podcast: {
    id: 'podcast',
    name: 'Podcast clip / Interview',
    format: 'B', // Chat style
    duration: 30,
    mood: 'lofi_beats',
    accentColor: '#8B5CF6',
    audience: 'Age 22–45, thinkers, entrepreneurs, intellectual curiosity',
    keyGoal: 'Save + share (insightful conversation points)',
    hashtagSets: {
      set_1: '#podcast #podcastclips #interview #interestingconversation #knowledgepodcast #podcastindia #learnfromothers #insightful #thoughtleadership #mindexpanding',
      set_2: '#podcasting #interviewclips #wisdom #deepconversation #businesspodcast #mindsetshift #lifeadvice #successstories #knowledgebomb #curiosity',
      set_3: '#podcaster #inspirationalpodcast #growthpodcast #learnfromexperts #thoughtprovoking #keytakeaways #podcastrecommendations #conversations #mindset #perspective',
    },
  },
};

module.exports = {
  CATEGORIES,
};
