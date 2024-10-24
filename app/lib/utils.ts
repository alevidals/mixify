import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { FormError } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrors<T>(error: ZodError<T>) {
  const { fieldErrors } = error.flatten();
  const errors: FormError<T> = {};

  for (const [key, value] of Object.entries(fieldErrors)) {
    errors[key as keyof T] = (value as string[])[0];
  }

  return errors;
}
