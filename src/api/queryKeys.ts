/**
 * Centralized TanStack Query key factory.
 * Using factory functions ensures type-safe, consistent keys across the app.
 */
export const queryKeys = {
  patients: {
    all: () => ["patients"] as const,
    byUhid: (uhid: string) => ["patients", "uhid", uhid] as const,
    adminList: (filters?: { status?: string; department?: string }) =>
      ["patients", "admin", filters] as const,
  },
  opd: {
    session: (visitId: string) => ["opd", "session", visitId] as const,
    all: () => ["opd"] as const,
  },
};
