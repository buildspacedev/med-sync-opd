export type Language = "en" | "hi" | "fr" | "ar";
export type CaptureMode = "manual" | "voice" | "image";
export type Gender = "male" | "female" | "other";

export interface PatientDemographics {
  name: string;
  fatherHusbandName: string;
  age: string;
  gender: Gender | "";
  address: string;
  mobile: string;
  otpVerified?: boolean;
}

export interface Vitals {
  height: string;
  weight: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  pulse: string;
  temperature: string;
  spo2: string;
}

export type Specialty =
  | "General Medicine"
  | "Cardiology"
  | "Cardiothoracic & Vascular Surgery (CTVS)"
  | "Dermatology & Venereology"
  | "Endocrinology, Metabolism & Diabetes"
  | "Gastrointestinal Surgery"
  | "Haematology"
  | "Nephrology"
  | "Rheumatology"
  | "Urology"
  | "Orthopaedics"
  | "Gynaecology"
  | "Paediatrics"
  | "Ophthalmology"
  | "ENT"
  | "Psychiatry";

export const SUPER_SPECIALTIES: Specialty[] = [
  "Cardiology",
  "Cardiothoracic & Vascular Surgery (CTVS)",
  "Dermatology & Venereology",
  "Endocrinology, Metabolism & Diabetes",
  "Gastrointestinal Surgery",
  "Haematology",
  "Nephrology",
  "Rheumatology",
  "Urology",
];

export const SPECIALTY_ROOMS: Record<Specialty, string> = {
  "General Medicine": "OPD-101",
  Cardiology: "OPD-201",
  "Cardiothoracic & Vascular Surgery (CTVS)": "OPD-202",
  "Dermatology & Venereology": "OPD-203",
  "Endocrinology, Metabolism & Diabetes": "OPD-204",
  "Gastrointestinal Surgery": "OPD-205",
  Haematology: "OPD-206",
  Nephrology: "OPD-207",
  Rheumatology: "OPD-208",
  Urology: "OPD-209",
  Orthopaedics: "OPD-301",
  Gynaecology: "OPD-302",
  Paediatrics: "OPD-303",
  Ophthalmology: "OPD-304",
  ENT: "OPD-305",
  Psychiatry: "OPD-306",
};

export interface OPDSession {
  language: Language;
  uhid: string;
  isNewPatient: boolean;
  captureMode: CaptureMode;
  demographics: PatientDemographics;
  symptoms: string[];
  assignedSpecialty: Specialty | "";
  roomNumber: string;
  vitals: Vitals;
  referralVerified: boolean;
  referralRequired: boolean;
  visitId: string;
  visitDate: string;
  imageExtracted: boolean;
}

export interface AdminPatient {
  id: string;
  uhid: string;
  name: string;
  specialty: string;
  room: string;
  status: "waiting" | "in-progress" | "completed";
  visitDate: string;
  mobile: string;
}
