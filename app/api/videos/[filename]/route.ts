import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const cleanFilename = path.basename(filename);

    const rootDir = process.cwd();
    // Check /tmp first (for Vercel serverless), then public/videos and remotion/out
    const possiblePaths = [
      path.join(os.tmpdir(), 'videos', cleanFilename),
      path.join(os.tmpdir(), 'faceless-shorts', 'videos', cleanFilename),
      path.join(rootDir, 'public', 'videos', cleanFilename),
      path.join(rootDir, 'remotion', 'out', cleanFilename),
    ];

    let filePath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: `Video file not found: ${cleanFilename}` }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const url = new URL(req.url);
    const isDownload = url.searchParams.get('download') === 'true';

    // Handle HTTP Range header for video seeking and streaming
    const range = req.headers.get('range');
    if (range && !isDownload) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new Response('Requested range not satisfiable', {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      // Convert Node.js ReadStream to Web ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on('data', (chunk) => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', (err) => controller.error(err));
        },
        cancel() {
          fileStream.destroy();
        },
      });

      return new Response(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }

    // Full file stream (or download)
    const fileStream = fs.createReadStream(filePath);
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    const headers: Record<string, string> = {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    };

    if (isDownload) {
      headers['Content-Disposition'] = `attachment; filename="${cleanFilename}"`;
    }

    return new Response(stream, { headers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
