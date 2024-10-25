import { json, redirect } from "@remix-run/node";
import { and, desc, eq } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { db } from "~/lib/db/drizzle";
import { playlistsSchema } from "~/lib/db/schema";
import { requireUserId } from "~/lib/models/auth.server";
import { FormError } from "~/lib/types";
import { getErrors } from "~/lib/utils";

export async function getPlaylists(userId: string) {
  const playlists = await db
    .select({
      id: playlistsSchema.id,
      name: playlistsSchema.name,
      slug: playlistsSchema.slug,
    })
    .from(playlistsSchema)
    .where(eq(playlistsSchema.userId, userId))
    .orderBy(desc(playlistsSchema.createdAt));

  return playlists;
}

async function existsPlaylist(slug: string, userId: string) {
  const playlist = await db
    .select()
    .from(playlistsSchema)
    .where(
      and(eq(playlistsSchema.slug, slug), eq(playlistsSchema.userId, userId))
    )
    .limit(1);

  return playlist.length !== 0;
}

const addPlaylistSchema = z.object({
  name: z.string(),
});

type AddPlaylist = z.infer<typeof addPlaylistSchema>;

export async function addPlaylist(request: Request) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const result = await addPlaylistSchema.safeParseAsync(data);
  let errors: FormError<AddPlaylist> = {};

  if (!result.success) {
    errors = getErrors<AddPlaylist>(result.error);
    return json({ errors }, { status: 400 });
  }

  const { name } = result.data;
  const slug = slugify(name);

  const exists = await existsPlaylist(slug, userId);

  if (exists) {
    errors.formError = "A playlist with this name already exists";
    return json({ errors }, { status: 400 });
  }

  const [createdPlaylist] = await db
    .insert(playlistsSchema)
    .values({
      name,
      slug,
      userId,
    })
    .returning({
      slug: playlistsSchema.slug,
    });

  return redirect(`/${createdPlaylist.slug}`);
}
