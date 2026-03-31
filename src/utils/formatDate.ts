import dayjs from "dayjs";

/**
 * Utility to format ISO date strings to localized display strings.
 * @param date - The ISO date string to format.
 * @param format - The format string to use. Default is "DD/MM/YYYY".
 * @returns The formatted date string.
 */
export function formatDate(date: string, format: string = "DD/MM/YYYY"): string {
  if (!date) return "";
  return dayjs(date).format(format);
}

/**
 * Utility to format ISO date strings with time.
 * @param date - The ISO date string to format.
 * @returns The formatted date and time string.
 */
export function formatDateTime(date: string): string {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}
