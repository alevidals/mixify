import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { getUser, requireUserId } from "~/lib/models/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUser(userId);
  return json({ user });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const signOutFetcher = useFetcher();

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Hi {loaderData.user.username}!. Welcome to mixify
      </h1>
      <signOutFetcher.Form method="post" action="/logout">
        <Button variant="link">Logout</Button>
      </signOutFetcher.Form>
    </div>
  );
}
