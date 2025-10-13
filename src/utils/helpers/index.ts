import { ENVIRONMENT } from "@/utils/constants";

export const isDevelopmentMode = ENVIRONMENT === "development";
export const isProductionMode = ENVIRONMENT === "production";

export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
