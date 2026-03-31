/**
 * Default TanStack Query configuration for the application.
 * Defines cache and stale times for server-side state.
 */
export const QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  GC_TIME: 1000 * 60 * 60,   // 1 hour
  RETRY: 1,
} as const;

export default QUERY_CONFIG;
