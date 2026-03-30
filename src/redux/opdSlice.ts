import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Language,
  CaptureMode,
  PatientDemographics,
  Vitals,
  Specialty,
  OPDSession,
} from "@/types/opd";

const initialVitals: Vitals = {
  height: "",
  weight: "",
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  pulse: "",
  temperature: "",
  spo2: "",
};

const initialDemographics: PatientDemographics = {
  name: "",
  fatherHusbandName: "",
  age: "",
  gender: "",
  address: "",
  mobile: "",
  otpVerified: false,
};

const initialState: OPDSession = {
  language: "en",
  uhid: "",
  isNewPatient: false,
  captureMode: "manual",
  demographics: initialDemographics,
  symptoms: [],
  assignedSpecialty: "",
  roomNumber: "",
  vitals: initialVitals,
  referralVerified: false,
  referralRequired: false,
  visitId: "",
  visitDate: "",
  imageExtracted: false,
};

const opdSlice = createSlice({
  name: "opd",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    setUHID(state, action: PayloadAction<{ uhid: string; isNew: boolean }>) {
      state.uhid = action.payload.uhid;
      state.isNewPatient = action.payload.isNew;
    },
    setCaptureMode(state, action: PayloadAction<CaptureMode>) {
      state.captureMode = action.payload;
    },
    setDemographics(state, action: PayloadAction<PatientDemographics>) {
      state.demographics = action.payload;
    },
    updateDemographic(
      state,
      action: PayloadAction<Partial<PatientDemographics>>
    ) {
      state.demographics = { ...state.demographics, ...action.payload };
    },
    setSymptoms(state, action: PayloadAction<string[]>) {
      state.symptoms = action.payload;
    },
    addSymptom(state, action: PayloadAction<string>) {
      if (!state.symptoms.includes(action.payload)) {
        state.symptoms.push(action.payload);
      }
    },
    removeSymptom(state, action: PayloadAction<string>) {
      state.symptoms = state.symptoms.filter((s) => s !== action.payload);
    },
    setSpecialty(
      state,
      action: PayloadAction<{ specialty: Specialty; room: string }>
    ) {
      state.assignedSpecialty = action.payload.specialty;
      state.roomNumber = action.payload.room;
    },
    setVitals(state, action: PayloadAction<Vitals>) {
      state.vitals = action.payload;
    },
    updateVital(state, action: PayloadAction<Partial<Vitals>>) {
      state.vitals = { ...state.vitals, ...action.payload };
    },
    setReferralVerified(state, action: PayloadAction<boolean>) {
      state.referralVerified = action.payload;
    },
    setReferralRequired(state, action: PayloadAction<boolean>) {
      state.referralRequired = action.payload;
    },
    setImageExtracted(state, action: PayloadAction<boolean>) {
      state.imageExtracted = action.payload;
    },
    finaliseVisit(state) {
      state.visitId = `OPD-${Date.now()}`;
      state.visitDate = new Date().toISOString();
    },
    resetSession() {
      return { ...initialState };
    },
  },
});

export const {
  setLanguage,
  setUHID,
  setCaptureMode,
  setDemographics,
  updateDemographic,
  setSymptoms,
  addSymptom,
  removeSymptom,
  setSpecialty,
  setVitals,
  updateVital,
  setReferralVerified,
  setReferralRequired,
  setImageExtracted,
  finaliseVisit,
  resetSession,
} = opdSlice.actions;

export default opdSlice.reducer;
