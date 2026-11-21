import { GenerationJob } from './types';

// Store in globalThis to preserve jobs across Next.js development module reloads
const globalForJobs = globalThis as unknown as {
  jobsStore?: Map<string, GenerationJob>;
  listenersStore?: Map<string, Set<(job: GenerationJob) => void>>;
};

const jobs = globalForJobs.jobsStore || new Map<string, GenerationJob>();
const listeners = globalForJobs.listenersStore || new Map<string, Set<(job: GenerationJob) => void>>();

if (process.env.NODE_ENV !== 'production') {
  globalForJobs.jobsStore = jobs;
  globalForJobs.listenersStore = listeners;
}

export function createJob(topic: string, niche: string): GenerationJob {
  const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const job: GenerationJob = {
    id,
    topic,
    niche,
    status: 'queued',
    progress: 5,
    message: 'Job queued...',
    createdAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): GenerationJob | undefined {
  return jobs.get(id);
}

export function listJobs(): GenerationJob[] {
  return Array.from(jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function updateJob(id: string, updates: Partial<GenerationJob>): GenerationJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;

  const updated: GenerationJob = { ...job, ...updates };
  jobs.set(id, updated);

  const jobListeners = listeners.get(id);
  if (jobListeners) {
    jobListeners.forEach((cb) => cb(updated));
  }

  return updated;
}

export function subscribeToJob(id: string, callback: (job: GenerationJob) => void): () => void {
  if (!listeners.has(id)) {
    listeners.set(id, new Set());
  }
  const set = listeners.get(id)!;
  set.add(callback);

  return () => {
    set.delete(callback);
    if (set.size === 0) {
      listeners.delete(id);
    }
  };
}
