/**
 * Lokale admin aanmaken of wachtwoord resetten. Geen hardcoded credentials in Git.
 *
 * Gebruik:
 *   npx tsx scripts/auth-setup.ts
 *   AUTH_USERNAME=admin AUTH_PASSWORD='...' npx tsx scripts/auth-setup.ts
 */
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function prompt(question: string, hidden = false): Promise<string> {
  if (process.env.AUTH_USERNAME && question.includes("Gebruikersnaam")) {
    return process.env.AUTH_USERNAME;
  }
  if (process.env.AUTH_PASSWORD && question.includes("Wachtwoord")) {
    return process.env.AUTH_PASSWORD;
  }
  if (hidden && !process.stdin.isTTY) {
    throw new Error("Wachtwoord vereist via AUTH_PASSWORD in niet-interactieve modus.");
  }
  const rl = createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

async function main() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
  if (!process.env.AUTH_SECRET) {
    console.warn("Waarschuwing: AUTH_SECRET ontbreekt in omgeving; zet deze in .env.");
  }

  const username = (await prompt("Gebruikersnaam: ")) || "admin";
  const password = await prompt("Wachtwoord (min. 10 tekens): ", true);
  if (password.length < 10) {
    throw new Error("Wachtwoord moet minstens 10 tekens zijn.");
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.upsert({
    where: { username },
    create: { username, passwordHash },
    update: { passwordHash },
  });
  console.log(`Gebruiker «${username}» is klaar voor lokale login.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
