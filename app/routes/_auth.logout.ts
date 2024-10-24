import { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/lib/models/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
