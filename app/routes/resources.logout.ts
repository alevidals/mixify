import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/lib/models/auth.server";

export function loader() {
  return redirect("/login");
}

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
