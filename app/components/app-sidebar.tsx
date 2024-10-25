import { Link, useLocation, useRouteLoaderData } from "@remix-run/react";
import { AddPlaylistDialog } from "~/components/add-playlist-dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { loader } from "~/routes/_app";

export function AppSidebar() {
  const data = useRouteLoaderData<typeof loader>("routes/_app");
  const location = useLocation();

  return (
    <Sidebar variant="floating">
      <SidebarHeader>Mixify</SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Playlists</SidebarGroupLabel>
              <SidebarGroupAction title="Add playlist" asChild>
                <AddPlaylistDialog />
              </SidebarGroupAction>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {data?.playlists.map((playlist) => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === `/${playlist.slug}`}
                      className="data-[active=true]:text-primary"
                    >
                      <Link to={`/${playlist.slug}`}>{playlist.name}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>Footer</SidebarFooter>
    </Sidebar>
  );
}
