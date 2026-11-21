'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Video, Play, Download, Terminal, Clock, CheckCircle2, AlertCircle, Loader2, Key } from 'lucide-react';
import { GenerationJob } from '@/lib/types';

const SUGGESTIONS = [
  'Why Cold Showers Spike Dopamine for Hours',
  '3 Surprising Signs of Vitamin B12 Deficiency',
  'Redis Caching in Node.js: 200x Speedup',
  'Undo Any Git Mistake with git reflog',
  'PostgreSQL Indexing: B-Tree vs Hash',
  'Docker Multi-Stage Builds in 40 Seconds',
];

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [niche, setNiche] = useState('terminal');
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<GenerationJob[]>([]);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'beats' | 'history'>('preview');

  useEffect(() => {
    const savedKey = localStorage.getItem('GROQ_API_KEY') || '';
    if (savedKey) setApiKey(savedKey);
    fetchRecentJobs();
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('GROQ_API_KEY', key);
  };

  const fetchRecentJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setRecentJobs(data);
      }
    } catch (e) {
      console.error('Failed to fetch jobs:', e);
    }
  };

  const handleStartGeneration = async () => {
    if (!topic.trim()) return;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          niche,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to start generation');
        return;
      }

      subscribeToJobStream(data.jobId);
    } catch (err: any) {
      alert(`Error starting generation: ${err.message}`);
    }
  };

  const subscribeToJobStream = (jobId: string) => {
    const eventSource = new EventSource(`/api/jobs/${jobId}?stream=true`);

    eventSource.onmessage = (event) => {
      try {
        const job: GenerationJob = JSON.parse(event.data);
        setActiveJob(job);
        if (job.status === 'completed' || job.status === 'failed') {
          eventSource.close();
          fetchRecentJobs();
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  };

  const isGenerating = Boolean(activeJob && activeJob.status !== 'completed' && activeJob.status !== 'failed');

  const getVideoUrl = (rawUrl?: string, download = false) => {
    if (!rawUrl) return '';
    const filename = rawUrl.split('/').pop();
    return `/api/videos/${filename}${download ? '?download=true' : ''}`;
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-gray-800/80 bg-[#0d0f17]/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight">Faceless Shorts Factory</h1>
              <span className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Groq openai/gpt-oss-120b
              </span>
            </div>
            <p className="text-xs text-gray-400">Pure-TSX Remotion Generation • 1080×1920 @ 30fps</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800/70 hover:bg-gray-800 text-gray-300 border border-gray-700/50 transition"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            {apiKey ? 'API Key Configured' : 'Set Groq API Key'}
          </button>
        </div>
      </header>

      {/* Optional API Key banner */}
      {showKeyInput && (
        <div className="bg-[#121522] border-b border-amber-500/20 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <span className="text-xs text-gray-400 whitespace-nowrap">Groq API Key:</span>
            <input
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              className="flex-1 bg-black/40 border border-gray-700 px-3 py-1 text-xs rounded text-gray-200 focus:outline-none focus:border-amber-400"
            />
          </div>
          <p className="text-[11px] text-gray-400">
            Keys can also be configured in <code className="bg-gray-800 px-1 py-0.5 rounded text-amber-300">.env</code>.
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Controller */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#111420] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />

            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Generate YouTube Short
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Enter any technical or educational topic. Groq will generate the 35s beat sheet and Remotion will render the 1080×1920 MP4.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Topic or Script Prompt
                </label>
                <div className="relative">
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic or full prompt (e.g. 3 Surprising Signs of Vitamin B12 Deficiency)..."
                    disabled={isGenerating}
                    rows={topic.length > 80 ? 4 : 2}
                    className="w-full bg-[#0a0c13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition max-h-44 overflow-y-scroll resize-none"
                  />
                </div>
              </div>

              {/* Suggestions: Only visible when input is empty */}
              {!topic.trim() && (
                <div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-2 font-medium">
                    Try an idea:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setTopic(sug)}
                        disabled={isGenerating}
                        className="text-xs px-2.5 py-1 rounded-lg bg-gray-800/60 hover:bg-gray-800 hover:text-amber-300 text-gray-300 border border-gray-700/40 transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Style Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Visual Style
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'terminal', name: 'Terminal / CLI', icon: Terminal, desc: 'Typing animation & command logs' },
                    { id: 'algo', name: 'Code & Logic', icon: Video, desc: 'Split layout & structured breakdown' },
                    { id: 'general', name: 'Explainer / General', icon: Sparkles, desc: 'Kinetic typography & topic cards' },
                  ].map((style) => {
                    const Icon = style.icon;
                    const selected = niche === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setNiche(style.id)}
                        disabled={isGenerating}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          selected
                            ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm'
                            : 'bg-[#0a0c13] border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${selected ? 'text-amber-400' : 'text-gray-400'}`} />
                          <span className="text-xs font-semibold text-gray-200">{style.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">{style.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartGeneration}
                disabled={isGenerating || !topic.trim()}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                  isGenerating || !topic.trim()
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/20 font-bold'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Manufacturing Short...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Generate Short MP4</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Progress Card */}
          {activeJob && (
            <div className="bg-[#111420] border border-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {activeJob.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : activeJob.status === 'failed' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-white">{activeJob.topic}</h3>
                    <p className="text-xs text-amber-400/90 font-mono font-medium">{activeJob.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {activeJob.renderPercent !== undefined ? `${activeJob.renderPercent}%` : `${activeJob.progress}%`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    activeJob.status === 'failed'
                      ? 'bg-red-500'
                      : activeJob.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                  }`}
                  style={{
                    width: `${
                      activeJob.renderPercent !== undefined
                        ? Math.max(activeJob.progress, activeJob.renderPercent)
                        : activeJob.progress
                    }%`,
                  }}
                />
              </div>

              {/* Stage Stepper */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800/60 text-[11px]">
                <div className={`flex flex-col items-center text-center ${activeJob.progress >= 20 ? 'text-amber-400' : 'text-gray-500'}`}>
                  <span className="font-semibold">1. Beats</span>
                  <span className="text-[10px] text-gray-500">Groq LLM</span>
                </div>
                <div className={`flex flex-col items-center text-center ${activeJob.progress >= 35 ? 'text-amber-400' : 'text-gray-500'}`}>
                  <span className="font-semibold">2. TSX Code</span>
                  <span className="text-[10px] text-gray-500">Remotion</span>
                </div>
                <div className={`flex flex-col items-center text-center ${activeJob.progress >= 45 ? 'text-amber-400' : 'text-gray-500'}`}>
                  <span className="font-semibold">3. Registry</span>
                  <span className="text-[10px] text-gray-500">Auto-gen</span>
                </div>
                <div className={`flex flex-col items-center text-center ${activeJob.status === 'completed' ? 'text-green-400' : activeJob.status === 'rendering' ? 'text-amber-400 font-bold' : 'text-gray-500'}`}>
                  <span className="font-semibold">
                    {activeJob.renderPercent !== undefined ? `4. Render (${activeJob.renderPercent}%)` : '4. Render'}
                  </span>
                  <span className="text-[10px] text-gray-500">MP4 Output</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Video Preview & Tabs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#111420] border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col items-center">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl mb-4 w-full border border-gray-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'preview' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Video Preview
              </button>
              <button
                onClick={() => setActiveTab('beats')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'beats' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Beats & Script
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'history' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                History ({recentJobs.length})
              </button>
            </div>

            {/* Video Preview Frame */}
            {activeTab === 'preview' && (
              <div className="w-full flex flex-col items-center">
                <div className="relative w-[280px] h-[497px] rounded-2xl bg-black border-2 border-gray-800 overflow-hidden shadow-2xl flex items-center justify-center">
                  {activeJob?.videoUrl ? (
                    <video
                      key={activeJob.videoUrl}
                      src={getVideoUrl(activeJob.videoUrl)}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-300">1080 × 1920 Vertical Canvas</p>
                        <p className="text-[11px] text-gray-500 mt-1">Rendered video preview will appear here</p>
                      </div>
                    </div>
                  )}
                </div>

                {activeJob?.videoUrl && (
                  <div className="w-full mt-4 flex gap-2">
                    <a
                      href={getVideoUrl(activeJob.videoUrl, true)}
                      download={`${activeJob.beats?.composition || 'short'}.mp4`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-green-500/20"
                    >
                      <Download className="w-4 h-4" />
                      Download Final MP4
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Beats & Script Tab */}
            {activeTab === 'beats' && (
              <div className="w-full h-[497px] overflow-auto bg-black/50 rounded-xl p-4 border border-gray-800 font-mono text-xs text-gray-300">
                {activeJob?.beats ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(activeJob.beats, null, 2)}</pre>
                ) : (
                  <p className="text-gray-500 text-center mt-32">No beats generated yet.</p>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="w-full h-[497px] overflow-auto flex flex-col gap-2">
                {recentJobs.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center mt-32">No recent shorts yet.</p>
                ) : (
                  recentJobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => setActiveJob(j)}
                      className="p-3 rounded-xl bg-black/40 border border-gray-800/80 hover:border-gray-700 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="flex-1 mr-2">
                        <p className="text-xs font-semibold text-gray-200 truncate">{j.topic}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(j.createdAt).toLocaleTimeString()} • {j.message || j.status}
                        </p>
                      </div>
                      {j.videoUrl && (
                        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                          Ready
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
