import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { beforeAll } from "vitest";

const testDb = path.join(process.cwd(), "prisma", "test-integration.db");

beforeAll(() => {
  if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: `file:${testDb}` },
    stdio: "inherit",
  });
});
