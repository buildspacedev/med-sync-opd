import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import type { PatientDemographics } from "../../types/opd";

/**
 * Payload for creating a new patient record.
 */
export interface CreatePatientPayload {
  demographics: PatientDemographics;
  uhid?: string;
}

/**
 * Mutation to create a new patient record.
 */
export function useCreatePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePatientPayload) => {
      // MOCK
      await new Promise((r) => setTimeout(r, 500));
      return { uhid: payload.uhid || `UHID-NEW-${Date.now()}`, ...payload };

      // REAL API (uncomment when backend ready):
      // const res = await apiClient.post('/patients', payload);
      // return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.all() });
    },
  });
}
