import { MetaFunction } from "@remix-run/react";
import { SidebarTrigger } from "~/components/ui/sidebar";

export const meta: MetaFunction = () => {
  return [
    { title: "Mixify" },
    {
      property: "og:title",
      content: "Mixify",
    },
    {
      name: "description",
      content:
        "Mixify is a music player that lets you create playlists and play them.",
    },
  ];
};

export default function Index() {
  return (
    <>
      <SidebarTrigger />
      <h1>Hello</h1>
    </>
  );
}
