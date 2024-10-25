import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { FormError } from "./types";
import getPixels from "get-pixels";
import { extractColors } from "extract-colors";

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

export function getProminentColor(src: string) {
  return new Promise<string | null>((resolve, reject) => {
    getPixels(src, (err, pixels) => {
      if (err) {
        reject(null);
      }

      const data = [...pixels.data];
      const [width, height] = pixels.shape;

      extractColors({ data, width, height }).then((colors) => {
        const color = colors.sort((a, b) => b.area - a.area)[0].hex;
        resolve(color);
      });
    });
  });
}
