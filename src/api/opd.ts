import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";
import { queryKeys } from "./queryKeys";
import type { OPDSession } from "@/types/opd";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubmitOPDPayload {
  session: OPDSession;
}

export interface SubmitOPDResult {
  visitId: string;
  visitDate: string;
  token: number;
}

export interface OPDSessionResult {
  visitId: string;
  visitDate: string;
  session: OPDSession;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Submit the completed OPD registration session to backend.
 * TODO: Replace mock with → apiClient.post('/opd/sessions', payload)
 */
export function useSubmitOPDSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SubmitOPDPayload): Promise<SubmitOPDResult> => {
      // MOCK
      await new Promise((r) => setTimeout(r, 1500));
      const visitId = `OPD-${Date.now()}`;
      return {
        visitId,
        visitDate: new Date().toISOString(),
        token: Math.floor(Math.random() * 50) + 1,
      };

      // REAL API (uncomment when backend ready):
      // const res = await apiClient.post<SubmitOPDResult>('/opd/sessions', payload);
      // return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opd.all() });
    },
  });
}

/**
 * Fetch a specific OPD session by visitId (e.g., for OPD card display).
 * TODO: Replace mock with → apiClient.get(`/opd/sessions/${visitId}`)
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
