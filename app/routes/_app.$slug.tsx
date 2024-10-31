import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { Play, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getPlaylist } from "~/lib/models/playlists.server";
import { getProminentColor } from "~/lib/utils";

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
  const [color, setColor] = useState<string>();

  useEffect(() => {
    async function getColor() {
      const color = await getProminentColor(playlist.imageUrl!);
      setColor(color);
    }

    getColor();
  }, [playlist]);

  return (
    <>
      <header
        className="p-6 pt-14 flex gap-10 border-b items-center relative"
        style={{
          background: `linear-gradient(180deg, ${color}, black)`,
        }}
      >
        <img
          src={playlist.imageUrl!}
          alt="playlistimage"
          className="size-56 rounded-lg z-10 object-cover"
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
      </header>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Button className="rounded-full [&_svg]:size-fit p-8" size="icon">
            <Play size={30} />
          </Button>
          <Input
            icon={<Search />}
            placeholder="Search..."
            className="w-64 h-12"
          />
        </div>
      </div>
    </>
  );
}
