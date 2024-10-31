import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, MetaFunction, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signUp } from "~/lib/models/auth.server";

export const meta: MetaFunction = () => [
  {
    title: "Mixify - Register",
  },
  {
    property: "og:title",
    content: "Mixify - Register",
  },
  {
    name: "description",
    content:
      "Mixify is a music player that lets you create playlists and play them.",
  },
];

export async function action({ request }: ActionFunctionArgs) {
  return signUp(request);
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Form method="post" className="grid gap-3">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
          />
          {actionData?.errors.username ? (
            <span className="text-xs font-bold text-red-500">
              {actionData.errors.username}
            </span>
          ) : null}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="Email" />
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
          />
          {actionData?.errors.password ? (
            <span className="text-xs font-bold text-red-500">
              {actionData.errors.password}
            </span>
          ) : null}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
          />
          {actionData?.errors.confirmPassword ? (
            <span className="text-xs font-bold text-red-500">
              {actionData.errors.confirmPassword}
            </span>
          ) : null}
        </div>
        <Button type="submit">Register</Button>
        {actionData?.errors.formError ? (
          <span className="text-xs font-bold text-red-500">
            {actionData.errors.formError}
          </span>
        ) : null}
      </Form>
      <Link to="/login" className="underline inline-block mt-5">
        Already have account? Login
      </Link>
    </div>
  );
}
