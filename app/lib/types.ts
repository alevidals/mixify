export type FormError<T> = Partial<Record<keyof T | "formError", string>>;
