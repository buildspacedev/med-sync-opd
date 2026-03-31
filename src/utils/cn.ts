import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Common utility to merge Tailwind CSS classes efficiently.
 * Combines standard clsx with tailwind-merge to handle class collisions.
 * @param inputs - The class values to merge.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
