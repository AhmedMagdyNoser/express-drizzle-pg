import { ENVIRONMENT } from "@/utils/constants";

export const isDevelopmentMode = ENVIRONMENT === "development";
export const isProductionMode = ENVIRONMENT === "production";

export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function extractErrorMessage(error: unknown): string {
  // Defensive type narrowing
  if (!error || typeof error !== "object") return String(error) || "Unknown error occurred.";

  const anyError = error as any;
  const pgError = anyError?.cause ?? anyError;

  // Check if it's actually a Postgres error (from pg)
  const isPgError = typeof pgError?.code === "string" && !!pgError?.message;

  if (isPgError)
    return `DATABASE ERROR ${pgError.code}: ${pgError.message}. ${pgError.detail}` || "A database error occurred.";

  // For non-PG errors, return their message or fallback
  return pgError?.message || "An unexpected error occurred.";
}
