import { json, redirect } from "@remix-run/node";
import { and, desc, eq } from "drizzle-orm";
import slugify from "slugify";
import { z } from "zod";
import { db } from "~/lib/db/drizzle";
import { playlistsSchema } from "~/lib/db/schema";
import { requireUserId } from "~/lib/models/auth.server";
import { FormError } from "~/lib/types";
import { getErrors, uploadFile } from "~/lib/utils";

export async function getPlaylist(slug: string) {
  const playlistsData = await db
    .select({
      id: playlistsSchema.id,
      name: playlistsSchema.name,
      slug: playlistsSchema.slug,
      imageUrl: playlistsSchema.imageUrl,
    })
    .from(playlistsSchema)
    .where(eq(playlistsSchema.slug, slug))
    .limit(1);

  if (!playlistsData.length) {
    throw redirect("/");
  }

  const [playlist] = playlistsData;

  return playlist;
}

export async function getPlaylists(userId: string) {
  const playlists = await db
    .select({
      id: playlistsSchema.id,
      name: playlistsSchema.name,
      slug: playlistsSchema.slug,
      imageUrl: playlistsSchema.imageUrl,
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

const addPlaylistSchema = z
  .object({
    name: z.string(),
    file: z.instanceof(File),
  })
  .superRefine((data, ctx) => {
    if (data.file.size > 1024 * 1024 * 2) {
      ctx.addIssue({
        code: "custom",
        message: "File size must be less than 2MB",
        path: ["file"],
      });
    }
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

  const { name, file } = result.data;
  const slug = slugify(name);

  const exists = await existsPlaylist(slug, userId);

  if (exists) {
    errors.formError = "A playlist with this name already exists";
    return json({ errors }, { status: 400 });
  }

  const response = await uploadFile(file);

  if (response.error) {
    errors.formError = "Error uploading file";
    return json({ errors }, { status: 400 });
  }

  const { url } = response.data;

  const [createdPlaylist] = await db
    .insert(playlistsSchema)
    .values({
      name,
      slug,
      userId,
      imageUrl: url,
    })
    .returning({
      slug: playlistsSchema.slug,
    });

  return redirect(`/${createdPlaylist.slug}`);
}
