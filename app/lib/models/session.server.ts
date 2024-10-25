import { createCookieSessionStorage, redirect } from "@remix-run/node";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

if (!process.env.SESSION_SECRET) {
  throw new Error("🔔 Warning: SESSION_SECRET is not set");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "session",
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      secrets: [process.env.SESSION_SECRET],
    },
  });

export async function createUserSession(
  userId: string,
  redirectTo: string,
  cookieHeader: string | null
) {
  const session = await getSession(cookieHeader);
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
