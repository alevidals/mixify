import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { requireUserId } from "~/lib/models/auth.server";
import { getPlaylists } from "~/lib/models/playlists.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const playlists = await getPlaylists(userId);

  return json({ playlists });
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full m-2 rounded-lg">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
