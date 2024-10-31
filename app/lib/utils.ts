import { clsx, type ClassValue } from "clsx";
import vibrant from "node-vibrant";
import { twMerge } from "tailwind-merge";
import { UTApi } from "uploadthing/server";
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

export async function getProminentColor(src: string) {
  try {
    const palette = await vibrant.from(src).getPalette();
    return palette.Vibrant?.hex;
  } catch (error) {
    return undefined;
  }
}

export async function uploadFile(file: File) {
  const utapi = new UTApi();
  const response = await utapi.uploadFiles(file);

  return response;
}
