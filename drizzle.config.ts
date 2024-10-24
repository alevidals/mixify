import type { Config } from "drizzle-kit";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Environment variables not defined");
}

export default {
  schema: "./app/lib/db/schema.ts",
  out: "./app/lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
