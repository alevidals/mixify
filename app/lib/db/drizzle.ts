import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

console.log("-->", process.env.TURSO_DATABASE_URL);
console.log("-->", process.env.TURSO_AUTH_TOKEN);

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Environment variables not defined");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
