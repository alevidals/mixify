import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getPlaylist } from "~/lib/models/playlists.server";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Mixify - ${params.slug}` },
    {
      property: "og:title",
      content: `Mixify - ${params.slug}`,
    },
    {
      name: "description",
      content:
        "Mixify is a music player that lets you create playlists and play them.",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.slug) throw redirect("/");

  const playlist = await getPlaylist(params.slug);

  return json({ playlist });
}

export default function PlaylistPage() {
  const { playlist } = useLoaderData<typeof loader>();

  return (
    <>
      <div
        className="p-6 pt-14 flex gap-10 border-b items-center relative"
        style={{
          background: `linear-gradient(180deg, ${playlist.color}, black)`,
        }}
      >
        <img
          src={playlist.imageUrl!}
          alt="playlistimage"
          className="size-56 rounded-lg z-10"
        />
        <div className="z-10">
          <h2 className="text-6xl font-black line-clamp-1 leading-normal">
            {playlist.name}
          </h2>
          <div className="text-sm">
            {/* mocked data */}
            <span>100 songs</span> - <span>5h 16min</span>
          </div>
        </div>
      </div>
    </>
  );
}
