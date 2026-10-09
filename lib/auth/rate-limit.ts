import { prisma } from "@/lib/db";
import { hashIp } from "./session";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

/** Eenvoudige DB-rate-limit voor single-process lokale setup. */
export async function checkLoginRateLimit(ip: string): Promise<{
  allowed: boolean;
  retryAfterSeconds?: number;
}> {
  const ipHash = hashIp(ip || "unknown");
  const since = new Date(Date.now() - WINDOW_MS);
  const count = await prisma.loginAttempt.count({
    where: { ipHash, attemptedAt: { gte: since } },
  });
  if (count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }
  return { allowed: true };
}

export async function recordLoginAttempt(ip: string): Promise<void> {
  const ipHash = hashIp(ip || "unknown");
  await prisma.loginAttempt.create({ data: { ipHash } });
  // opruimen oude pogingen
  const cutoff = new Date(Date.now() - WINDOW_MS * 2);
  await prisma.loginAttempt.deleteMany({ where: { attemptedAt: { lt: cutoff } } });
}
