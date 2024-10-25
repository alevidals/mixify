import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { addPlaylist } from "~/lib/models/playlists.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  return addPlaylist(request);
}
