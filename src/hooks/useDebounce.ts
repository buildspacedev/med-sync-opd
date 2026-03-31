import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value change.
 * Useful for search inputs to prevent excessive API calls.
 * @param value - The value to debounce.
 * @param delay - The delay in milliseconds. Default is 300ms.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
