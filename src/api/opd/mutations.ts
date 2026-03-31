import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import type { OPDSession } from "../../types/opd";

/**
 * Payload for submitting an OPD registration session.
 */
export interface SubmitOPDPayload {
  session: OPDSession;
}

/**
 * Result of a successful OPD registration.
 */
export interface SubmitOPDResult {
  visitId: string;
  visitDate: string;
  token: number;
}

/**
 * Mutation to submit the completed OPD registration session to the backend.
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
