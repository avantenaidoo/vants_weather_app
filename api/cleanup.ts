import type { IncomingMessage, ServerResponse } from 'http';
import { cleanupAllLogs } from "../backend/server/src/utils/cleanupLogs.js";

// Minimal types for Vercel serverless
type VercelRequest = IncomingMessage & { body?: any; query?: Record<string, string> };
type VercelResponse = ServerResponse & { json: (data: any) => void; status: (code: number) => VercelResponse };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await cleanupAllLogs();
  res.status(200).json({ ok: true });
}
