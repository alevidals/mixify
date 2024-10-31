import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, MetaFunction, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signIn } from "~/lib/models/auth.server";

export const meta: MetaFunction = () => [
  {
    title: "Mixify - Login",
  },
  {
    property: "og:title",
    content: "Mixify - Login",
  },
  {
    name: "description",
    content:
      "Mixify is a music player that lets you create playlists and play them.",
  },
];

export async function action({ request }: ActionFunctionArgs) {
  return signIn({ request });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Form method="post" className="grid gap-3">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          {actionData?.errors.email ? (
            <span className="text-xs font-bold text-red-500">
              {actionData.errors.email}
            </span>
          ) : null}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
          {actionData?.errors.password ? (
            <span className="text-xs font-bold text-red-500">
              {actionData.errors.password}
            </span>
          ) : null}
        </div>
        <Button type="submit">Login</Button>
        {actionData?.errors.formError ? (
          <span className="text-xs font-bold text-red-500">
            {actionData.errors.formError}
          </span>
        ) : null}
      </Form>
      <Link to="/register" className="underline inline-block mt-5">
        Don&apos;t have account? Register
      </Link>
    </div>
  );
}
