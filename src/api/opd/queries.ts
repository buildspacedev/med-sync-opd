import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import type { OPDSession } from "../../types/opd";

/**
 * Result of the OPD session inquiry.
 */
export interface OPDSessionResult {
  visitId: string;
  visitDate: string;
  session: OPDSession;
}

/**
 * Fetch a specific OPD session by visitId (e.g., for OPD card display).
 * @param visitId - The unique ID of the OPD visit session.
 */
export function useOPDSessionQuery(visitId: string) {
  return useQuery({
    queryKey: queryKeys.opd.session(visitId),
    queryFn: async (): Promise<OPDSessionResult | null> => {
      if (!visitId) return null;
      // MOCK
      await new Promise((r) => setTimeout(r, 300));
      return null;

      // REAL API (uncomment when backend ready):
      // const res = await apiClient.get<OPDSessionResult>(`/opd/sessions/${visitId}`);
      // return res.data;
    },
    enabled: !!visitId,
  });
}
