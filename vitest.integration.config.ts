import { defineConfig } from "vitest/config";
import path from "path";

const testDb = path.join(__dirname, "prisma", "test-integration.db");

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    fileParallelism: false,
    setupFiles: ["tests/integration/setup.ts"],
    env: {
      DATABASE_URL: `file:${testDb}`,
      AUTH_SECRET: "test-secret-for-integration",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
