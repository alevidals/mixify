import {
  Link,
  useFetcher,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import { AddPlaylistDialog } from "~/components/add-playlist-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
  const logoutFetcher = useFetcher();

  return (
    <Sidebar variant="floating">
      <SidebarHeader>Mixify</SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarGroup>
            <div className="flex items-center justify-between mb-4">
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
                      className="data-[active=true]:text-primary line-clamp-1 h-full flex gap-4"
                      title={playlist.name}
                    >
                      <Link to={`/${playlist.slug}`}>
                        <img
                          src={playlist.imageUrl!}
                          alt="playlistimage"
                          className="size-9 rounded-lg"
                        />
                        {playlist.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {data?.user.username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                  onClick={() =>
                    logoutFetcher.submit(null, {
                      method: "post",
                      action: "/resources/logout",
                    })
                  }
                >
                  <div className="flex">
                    <span>Sign out</span>
                    <LogOut className="ml-auto" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
