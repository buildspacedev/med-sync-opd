import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import type { AdminPatient, PatientDemographics } from "../../types/opd";

/**
 * Result of a patient UHID lookup.
 */
export interface PatientLookupResult {
  exists: boolean;
  uhid: string;
  demographics?: PatientDemographics;
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const MOCK_ADMIN_PATIENTS: AdminPatient[] = [
  { id: "1", uhid: "UHID-2024-1001", name: "Rahul Sharma", specialty: "Cardiology", room: "OPD-201", status: "waiting", visitDate: new Date().toISOString(), mobile: "9876543210" },
  { id: "2", uhid: "UHID-1002", name: "Priya Singh", specialty: "General Medicine", room: "OPD-101", status: "in-progress", visitDate: new Date().toISOString(), mobile: "9123456780" },
  { id: "3", uhid: "UHID-1003", name: "Amit Kumar", specialty: "Orthopaedics", room: "OPD-301", status: "completed", visitDate: new Date().toISOString(), mobile: "9988776655" },
  { id: "4", uhid: "UHID-1004", name: "Neha Patel", specialty: "Ophthalmology", room: "OPD-304", status: "waiting", visitDate: new Date().toISOString(), mobile: "9876512345" },
  { id: "5", uhid: "UHID-2024-1005", name: "Suresh Rao", specialty: "Gastrointestinal Surgery", room: "OPD-205", status: "waiting", visitDate: new Date().toISOString(), mobile: "9112233445" },
  { id: "6", uhid: "UHID-1006", name: "Anita Desai", specialty: "Dermatology & Venereology", room: "OPD-203", status: "completed", visitDate: new Date().toISOString(), mobile: "9898989898" },
];

/**
 * Look up a patient by UHID.
 * @param uhid - The Unique Health ID to look for.
 */
export function usePatientQuery(uhid: string) {
  return useQuery({
    queryKey: queryKeys.patients.byUhid(uhid),
    queryFn: async (): Promise<PatientLookupResult> => {
      // MOCK: anything starting with "UHID-1" exists
      await new Promise((r) => setTimeout(r, 800));
      const exists = uhid.toUpperCase().startsWith("UHID-1");
      return { exists, uhid: uhid.toUpperCase() };

      // REAL API (uncomment when backend ready):
      // const res = await apiClient.get<PatientLookupResult>(`/patients/lookup/${uhid}`);
      // return res.data;
    },
    enabled: !!uhid,
  });
}

/**
 * Fetch all patients for the admin dashboard.
 * @param filters - The status and department filters for the admin view.
 */
export function useAdminPatientsQuery(filters?: { status?: string; department?: string }) {
  return useQuery({
    queryKey: queryKeys.patients.adminList(filters),
    queryFn: async (): Promise<AdminPatient[]> => {
      // MOCK
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_ADMIN_PATIENTS;

      // REAL API (uncomment when backend ready):
      // const res = await apiClient.get<AdminPatient[]>('/admin/patients', { params: filters });
      // return res.data;
    },
  });
}
