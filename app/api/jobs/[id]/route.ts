import { NextResponse } from 'next/server';
import { getJob, subscribeToJob } from '@/lib/jobs';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const url = new URL(req.url);
  const isSSE = url.searchParams.get('stream') === 'true';

  if (!isSSE) {
    return NextResponse.json(job);
  }

  // Server-Sent Events (SSE) stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial state
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(job)}\n\n`));

      if (job.status === 'completed' || job.status === 'failed') {
        controller.close();
        return;
      }

      const unsubscribe = subscribeToJob(id, (updatedJob) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(updatedJob)}\n\n`));
          if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
            unsubscribe();
            controller.close();
          }
        } catch {
          unsubscribe();
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
