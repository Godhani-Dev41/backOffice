export interface ObjectStringValues {
  [index: string]: string;
}

export interface CustomError extends Error {
  meta?: Record<string, unknown>;
}
