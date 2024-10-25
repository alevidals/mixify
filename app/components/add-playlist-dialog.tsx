import { useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { useMediaQuery } from "~/hooks/use-media-query";
import { addPlaylist } from "~/lib/models/playlists.server";
import { cn } from "~/lib/utils";

const title = "Add playlist";
const description = "Fill out the form to add a new playlist";

function PlaylistForm({
  className,
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  const navigation = useNavigation();
  const fetcher = useFetcher<typeof addPlaylist>();
  const location = useLocation();
  const isMountingRef = useRef(false);

  const isLoading = navigation.state !== "idle";

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  // TODO: try to find out a better way to achieve that
  useEffect(() => {
    if (!isMountingRef.current) {
      setOpen(false);
    } else {
      isMountingRef.current = false;
    }
  }, [location.pathname]);

  return (
    <fetcher.Form
      action="/resources/playlists"
      method="post"
      className={cn("grid items-start gap-4", className)}
    >
      <Input type="text" placeholder="Playlist name" name="name" required />
      {fetcher.data?.errors.name ? (
        <span className="text-xs font-bold text-red-500">
          {fetcher.data.errors.name}
        </span>
      ) : null}
      {fetcher.data?.errors.formError ? (
        <span className="text-xs font-bold text-red-500">
          {fetcher.data.errors.formError}
        </span>
      ) : null}
      <Button type="submit">{isLoading ? "Loading..." : "Save"}</Button>
    </fetcher.Form>
  );
}

export function AddPlaylistDialog() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="h-8">
          <Button variant="ghost" size="icon">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <PlaylistForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <DialogTrigger asChild className="h-8">
          <Button variant="ghost" size="icon">
            <Plus />
          </Button>
        </DialogTrigger>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <PlaylistForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
