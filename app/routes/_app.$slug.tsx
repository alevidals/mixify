import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader({ params }: LoaderFunctionArgs) {
  return json({ slug: params.slug });
}

export default function PlaylistPage() {
  const { slug } = useLoaderData<typeof loader>();

  return <div className="text-primary">playlist - {slug}</div>;
}
