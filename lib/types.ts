import { z } from 'zod';

export const VoWordSchema = z.object({
  w: z.string(),
  start: z.number(),
  end: z.number(),
});

export const VoLineSchema = z.object({
  beat: z.string().default('beat'),
  text: z.string().describe('Exact voiceover narration text (conversational, punchy)'),
  start: z.number().default(0),
  end: z.number().default(3),
  words: z.array(VoWordSchema).optional(),
});

export const BeatItemSchema = z.object({
  id: z.string().default('beat'),
  start: z.number().default(0),
  end: z.number().default(5),
  visual: z.string().default(''),
  kicker: z.string().optional(),
});

export const BeatsSchema = z.object({
  id: z.string().default('short-generated'),
  title: z.string().default('Short Video'),
  composition: z.string().default('ShortGenerated'),
  format: z
    .object({
      width: z.number().default(1080),
      height: z.number().default(1920),
      fps: z.number().default(30),
      durationSec: z.number().default(35),
    })
    .default({ width: 1080, height: 1920, fps: 30, durationSec: 35 }),
  niche: z.string().default('general'),
  terminalSession: z
    .array(
      z.object({
        kind: z.string().default('out'),
        text: z.string().default(''),
        at: z.number().default(0),
        type: z.boolean().optional(),
        hl: z.string().optional(),
      })
    )
    .optional(),
  vo: z.array(VoLineSchema),
  beats: z.array(BeatItemSchema).default([]),
});

export type BeatsJson = z.infer<typeof BeatsSchema>;
export type VoLine = z.infer<typeof VoLineSchema>;

export interface GenerationJob {
  id: string;
  topic: string;
  niche: string;
  status: 'queued' | 'generating_script' | 'generating_tsx' | 'synthesizing_voice' | 'rendering' | 'completed' | 'failed';
  progress: number;
  renderPercent?: number;
  message: string;
  videoUrl?: string;
  error?: string;
  createdAt: number;
  beats?: BeatsJson;
}
