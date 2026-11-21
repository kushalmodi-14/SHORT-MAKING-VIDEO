import { NextResponse } from 'next/server';
import { createJob, updateJob } from '@/lib/jobs';
import { generateBeats } from '@/lib/chains/scriptChain';
import { generateTsx, buildVoGenTs } from '@/lib/chains/tsxChain';
import { runGenerationPipeline } from '@/lib/render';

export async function POST(req: Request) {
  try {
    const { topic, niche = 'terminal', apiKey } = await req.json();

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const rawKey = apiKey || process.env.GROQ_API_KEY || '';
    const groqKey = rawKey.replace(/^["']|["']$/g, '').trim();
    if (!groqKey) {
      return NextResponse.json(
        { error: 'Groq API Key is required. Please set GROQ_API_KEY in .env or provide it in the input.' },
        { status: 400 }
      );
    }

    // Create background job
    const job = createJob(topic.trim(), niche);

    // Run async in background (non-blocking)
    (async () => {
      try {
        updateJob(job.id, {
          status: 'generating_script',
          progress: 15,
          message: 'Groq (llama-3.3-70b-versatile) is generating script and beat sheet...',
        });

        // 1. Generate Beats Contract via Groq
        const beats = await generateBeats(topic.trim(), groqKey);

        updateJob(job.id, {
          status: 'generating_tsx',
          progress: 30,
          message: 'Groq is synthesizing the Remotion TSX composition...',
          beats,
        });

        // 2. Generate TSX Composition
        const tsx = await generateTsx(beats, groqKey);
        const voGenTs = buildVoGenTs(beats.vo);

        // 3. Render MP4 Video
        await runGenerationPipeline(job.id, beats, tsx, voGenTs);
      } catch (err: any) {
        console.error('Job failed:', err);
        updateJob(job.id, {
          status: 'failed',
          progress: 0,
          message: `Generation failed: ${err.message || 'Unknown error'}`,
          error: err.message,
        });
      }
    })();

    return NextResponse.json({ jobId: job.id, status: job.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
