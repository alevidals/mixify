import { json, redirect } from "@remix-run/node";
import bcryptjs from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/lib/db/drizzle";
import { usersSchema } from "~/lib/db/schema";
import {
  createUserSession,
  destroySession,
  getSession,
} from "~/lib/models/session.server";
// import {  registerSchema } from "~/lib/schemas";
import { FormError } from "~/lib/types";
import { getErrors } from "~/lib/utils";

const { hash, compare } = bcryptjs;

const SALT_ROUNDS = 10;

async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return await compare(password, hash);
}

export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return userId;
}

export async function requireUserId(request: Request, redirectTo?: string) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect(redirectTo ?? "/login");
  }

  return userId;
}

export async function getUser(userId: string) {
  const usersData = await db
    .select({
      id: usersSchema.id,
      username: usersSchema.username,
      email: usersSchema.email,
    })
    .from(usersSchema)
    .where(eq(usersSchema.id, userId))
    .limit(1);

  if (!usersData.length) {
    throw redirect("/login");
  }

  const [user] = usersData;

  return user;
}

const signInSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

type SignIn = z.infer<typeof signInSchema>;

export async function signIn({
  request,
  redirectTo = "/",
}: {
  request: Request;
  redirectTo?: string;
}) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const result = await signInSchema.safeParseAsync(data);
  let errors: FormError<SignIn> = {};

  if (!result.success) {
    errors = getErrors<SignIn>(result.error);

    return json({ errors }, { status: 400 });
  }

  const usersData = await db
    .select({ id: usersSchema.id, passwordHash: usersSchema.passwordHash })
    .from(usersSchema)
    .where(eq(usersSchema.email, result.data.email))
    .limit(1);

  if (usersData.length === 0) {
    errors.formError = "Invalid email or password";
    return json({ errors }, { status: 400 });
  }

  const [user] = usersData;

  const isPasswordValid = await comparePassword(
    result.data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    errors.formError = "Invalid email or password";
    return json({ errors }, { status: 400 });
  }

  return createUserSession(user.id, redirectTo, request.headers.get("Cookie"));
}

const signUpSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters long",
    }),
    email: z.string().email({
      message: "Invalid email",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type SignUp = z.infer<typeof signUpSchema>;

export async function signUp(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const result = await signUpSchema.safeParseAsync(data);
  let errors: FormError<SignUp> = {};

  if (!result.success) {
    errors = getErrors<SignUp>(result.error);
    return json({ errors }, { status: 400 });
  }

  const { username, email, password } = result.data;

  const existingUser = await db
    .select({ username: usersSchema.username, email: usersSchema.email })
    .from(usersSchema)
    .where(or(eq(usersSchema.username, username), eq(usersSchema.email, email)))
    .limit(1);

  if (existingUser.length !== 0) {
    errors.formError = "Username or email already taken";
    return json({ errors }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const [createdUser] = await db
    .insert(usersSchema)
    .values({
      username,
      email,
      passwordHash,
    })
    .returning();

  return createUserSession(createdUser.id, "/", request.headers.get("Cookie"));
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  throw redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
