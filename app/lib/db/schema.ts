import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const usersSchema = sqliteTable("users", {
  id: text("id").$defaultFn(randomUUID).primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const playlistsSchema = sqliteTable("playlists", {
  id: text("id").$defaultFn(randomUUID).primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  userId: text("user_id")
    .references(() => usersSchema.id)
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
