import { useState, useRef, useEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import { Upload } from "@/components/ui/Upload";
import { useToast } from "@/components/ui/Toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setLanguage,
  setUHID,
  setCaptureMode,
  setDemographics,
  setImageExtracted,
  addSymptom,
  removeSymptom,
  setSpecialty,
  setReferralRequired,
  setVitals,
  setReferralVerified,
  finaliseVisit,
} from "@/redux/opdSlice";
import { setUserLocale } from "@/redux/locale";
import {
  Language,
  CaptureMode,
  PatientDemographics,
  Vitals as VitalsType,
  Specialty,
  SPECIALTY_ROOMS,
  SUPER_SPECIALTIES,
} from "@/types/opd";
import { useSubmitOPDSessionMutation } from "@/api/opd";
import {
  Check,
  ChevronDown,
  Globe,
  IdCard,
  Camera,
  ScanLine,
  User,
  Activity,
  Heart,
  FileCheck,
  ClipboardList,
  Edit,
  Mic,
  CornerDownLeft,
  X,
  CheckCircle2,
  Loader2,
  UserPlus,
  Search,
  AlertCircle,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const languages: {
  id: Language;
  label: string;
  native: string;
  flag: string;
}[] = [
  { id: "en", label: "English", native: "English", flag: "🇬🇧" },
  { id: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { id: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
  { id: "fr", label: "French", native: "Français", flag: "🇫🇷" },
];

const commonSymptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Stomach Ache",
  "Chest Pain",
  "Joint Pain",
  "Skin Rash",
  "Blurry Vision",
  "Ear Pain",
];

const mapSymptomsToSpecialty = (symptoms: string[]): Specialty => {
  if (symptoms.length === 0) return "General Medicine";
  const s = symptoms.join(" ").toLowerCase();
  if (s.includes("chest pain") || s.includes("heart")) return "Cardiology";
  if (s.includes("stomach") || s.includes("vomiting"))
    return "Gastrointestinal Surgery";
  if (s.includes("joint") || s.includes("bone")) return "Orthopaedics";
  if (s.includes("skin") || s.includes("rash"))
    return "Dermatology & Venereology";
  if (s.includes("vision") || s.includes("eye")) return "Ophthalmology";
  if (s.includes("ear") || s.includes("throat")) return "ENT";
  if (s.includes("sugar") || s.includes("diabetes"))
    return "Endocrinology, Metabolism & Diabetes";
  return "General Medicine";
};

// ─── Section wrapper ────────────────────────────────────────────────────────

interface SectionProps {
  id: number;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  summary?: React.ReactNode;
  onHeaderClick: () => void;
  children: React.ReactNode;
}

function Section({
  id,
  icon,
  title,
  subtitle,
  isActive,
  isCompleted,
  isLocked,
  summary,
  onHeaderClick,
  children,
}: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (isActive && sectionRef.current) {
  //     setTimeout(() => {
  //       sectionRef.current?.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //       });
  //     }, 100);
  //   }
  // }, [isActive]);

  return (
    <div
      ref={sectionRef}
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden scroll-mt-6
      ${
        isActive
          ? "border-[#34b6b3] shadow-[0_8px_30px_rgba(52,182,179,0.12)]"
          : isCompleted
            ? "border-[#10b981]/30 bg-white/60"
            : "border-gray-100 bg-white/40 opacity-60"
      }`}
    >
      {/* Header */}
      <button
        onClick={onHeaderClick}
        disabled={isLocked}
        className={`w-full flex items-center gap-4 p-5 text-left transition-colors
          ${isActive ? "bg-[#34b6b3]/5" : isCompleted ? "bg-[#10b981]/3 hover:bg-gray-50" : "bg-white/50"}
          ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* Step circle */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
          ${
            isCompleted
              ? "bg-[#10b981] text-white shadow-md shadow-[#10b981]/20"
              : isActive
                ? "bg-[#34b6b3] text-white shadow-lg shadow-[#34b6b3]/30 ring-4 ring-[#34b6b3]/20"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
          }`}
        >
          {isCompleted ? <Check size={16} /> : id}
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-lg ${isActive ? "text-[#34b6b3]" : isCompleted ? "text-[#10b981]" : "text-gray-400"}`}
            >
              {title}
            </span>
            {isCompleted && (
              <span className="text-xs font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">
                Done
              </span>
            )}
          </div>
          {subtitle && !isCompleted && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
          {isCompleted && summary && (
            <div className="mt-1 text-sm text-gray-600">{summary}</div>
          )}
        </div>

        {/* Chevron */}
        <div
          className={`text-gray-300 transition-transform duration-300 ${isActive ? "rotate-180 text-[#34b6b3]" : ""}`}
        >
          {!isLocked && <ChevronDown size={20} />}
        </div>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export default function OPDWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const opdState = useAppSelector((s) => s.opd);

  const [activeSection, setActiveSection] = useState(0);

  const goTo = (n: number) => setActiveSection(n);
  const next = (n: number) => setActiveSection(n);

  const completedUpTo = activeSection; // sections 0..activeSection-1 are done

  const handleHeaderClick = (sectionId: number) => {
    if (sectionId < activeSection) setActiveSection(sectionId);
    else if (sectionId === activeSection) {
      // collapse — do nothing (stay open)
    }
  };

  // ── 1. Language ──────────────────────────────────────────────────────────
  const [selectedLang, setSelectedLang] = useState<Language>(opdState.language);
  const [, startLangTransition] = useTransition();

  const handleLangSelect = (lang: Language) => {
    setSelectedLang(lang);
    dispatch(setLanguage(lang));
    startLangTransition(() => {
      setUserLocale(lang).then(() => next(1));
    });
  };

  // ── 2. Patient ID ────────────────────────────────────────────────────────
  const [uhidInput, setUhidInput] = useState(opdState.uhid);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    if (!uhidInput.trim()) {
      toast(t("error_uhid_invalid"), "warning");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      const isExisting = uhidInput.toUpperCase().startsWith("UHID-1");
      if (isExisting) {
        toast(t("uhid_existing"), "success");
        dispatch(setUHID({ uhid: uhidInput.toUpperCase(), isNew: false }));
      } else {
        toast(t("uhid_not_found"), "info");
        dispatch(setUHID({ uhid: uhidInput.toUpperCase(), isNew: true }));
      }
      setVerifying(false);
      next(2);
    }, 800);
  };

  const handleNewPatient = () => {
    const newUhid = `UHID-NEW-${Math.floor(Math.random() * 10000)}`;
    dispatch(setUHID({ uhid: newUhid, isNew: true }));
    toast(t("uhid_new"), "success");
    next(2);
  };

  // ── 3. Capture Mode ──────────────────────────────────────────────────────
  const handleCaptureMode = (mode: CaptureMode) => {
    dispatch(setCaptureMode(mode));
    if (mode === "image")
      next(3); // go to image capture
    else next(4); // skip to demographics
  };

  // ── 4. Image Capture ─────────────────────────────────────────────────────
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);

  const handleFileSelect = (file: File) => {
    setExtracting(true);
    setTimeout(() => {
      setExtracting(false);
      setExtracted(true);
      dispatch(setImageExtracted(true));
      dispatch(
        setDemographics({
          name: "Rahul Sharma",
          fatherHusbandName: "Ramesh Sharma",
          age: "45",
          gender: "male",
          address: "123 Main St, New Delhi, 110001",
          mobile: "9876543210",
          otpVerified: false,
        }),
      );
      toast(t("ai_extracted_success"), "success");
      setTimeout(() => next(4), 1500);
    }, 2500);
  };

  // ── 5. Demographics ──────────────────────────────────────────────────────
  const [demo, setDemo] = useState<PatientDemographics>(opdState.demographics);
  const handleDemoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDemo((prev) => ({ ...prev, [name]: value }));
  };
  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setDemographics({
        ...demo,
        otpVerified: opdState.demographics.otpVerified,
      }),
    );
    next(5);
  };

  // ── 6. Symptoms ──────────────────────────────────────────────────────────
  const symptoms = useAppSelector((s) => s.opd.symptoms);
  const assignedSpecialty = useAppSelector((s) => s.opd.assignedSpecialty);
  const [symptomInput, setSymptomInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const symptomInputRef = useRef<any>(null);

  useEffect(() => {
    if (symptoms.length > 0) {
      const specialty = mapSymptomsToSpecialty(symptoms);
      const room = SPECIALTY_ROOMS[specialty];
      dispatch(setSpecialty({ specialty, room }));
      dispatch(setReferralRequired(SUPER_SPECIALTIES.includes(specialty)));
    } else {
      dispatch(
        setSpecialty({
          specialty: "General Medicine",
          room: SPECIALTY_ROOMS["General Medicine"],
        }),
      );
      dispatch(setReferralRequired(false));
    }
  }, [symptoms, dispatch]);

  const addSymptomHandler = (s: string) => {
    if (s.trim() && !symptoms.includes(s.trim())) {
      dispatch(addSymptom(s.trim()));
      setSymptomInput("");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        addSymptomHandler("Severe Headache");
      }, 3000);
    }
  };

  const handleSymptomsNext = () => {
    const referralRequired = SUPER_SPECIALTIES.includes(
      mapSymptomsToSpecialty(symptoms),
    );
    next(6); // vitals
  };

  // ── 7. Vitals ────────────────────────────────────────────────────────────
  const [vitals, setVitalsState] = useState<VitalsType>(opdState.vitals);
  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitalsState((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? undefined
          : name === "temperature"
            ? parseFloat(value)
            : parseInt(value),
    }));
  };
  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setVitals(vitals));
    if (opdState.referralRequired) next(7);
    else next(8);
  };
  const skipVitals = () => {
    if (opdState.referralRequired) next(7);
    else next(8);
  };

  // ── 8. Referral ──────────────────────────────────────────────────────────
  const [referralVerifyingState, setReferralVerifyingState] = useState(false);
  const [referralId, setReferralId] = useState("");

  const handleReferralVerify = () => {
    setReferralVerifyingState(true);
    setTimeout(() => {
      setReferralVerifyingState(false);
      dispatch(setReferralVerified(true));
      toast(t("referral_verified"), "success");
      setTimeout(() => next(8), 1000);
    }, 1500);
  };
  const handleReferralFile = (_file: File) => handleReferralVerify();

  // ── 9. Review & Submit ───────────────────────────────────────────────────
  const { mutate: submitOPD, isPending: submitting } =
    useSubmitOPDSessionMutation();
  const handleSubmit = () => {
    submitOPD(
      { session: opdState },
      {
        onSuccess: () => {
          dispatch(finaliseVisit());
          toast("Registration submitted successfully!", "success");
          navigate({ to: "/opd/opd-card" });
        },
      },
    );
  };

  // ─── Sections config ─────────────────────────────────────────────────────

  // Section 3 (image capture) only appears if mode === "image"
  const showReferral = opdState.referralRequired;

  // Map section index to "logical" step number for display
  // sections: 0=lang, 1=patient, 2=captureMode, 3=imageCapture, 4=demo, 5=symptoms, 6=vitals, 7=referral, 8=review
  const REVIEW_SECTION = showReferral ? 8 : 7;
  const SHOULD_SHOW_REFERRAL = showReferral && activeSection >= 7;

  // ─── Progress bar ─────────────────────────────────────────────────────────
  const totalSections = showReferral ? 9 : 8; // excluding image capture if not needed? Let's count all
  const progress = Math.round((activeSection / (totalSections - 1)) * 100);

  const LANG_LABELS = languages.find((l) => l.id === selectedLang);

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 mt-5">
        <div className="max-w-3xl mx-auto flex items-center gap-4 border-2 p-4 rounded-lg border-brand-primary">
          <span className="text-lg text-gray-400 whitespace-nowrap">
            Step {Math.min(activeSection + 1, totalSections)} of {totalSections}
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#34b6b3] to-[#0da0b8] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-bold text-[#34b6b3] w-10 text-right">
            {progress}%
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4 mt-6 px-2">
        {/* ── Section 0: Language ──────────────────────────────────────────── */}
        <Section
          id={1}
          icon={<Globe size={18} />}
          title={t("step1_language")}
          subtitle="Select your preferred language to continue"
          isActive={activeSection === 0}
          isCompleted={activeSection > 0}
          isLocked={false}
          onHeaderClick={() => handleHeaderClick(0)}
          summary={
            <span className="flex items-center gap-1.5">
              {LANG_LABELS?.flag} {LANG_LABELS?.native}
            </span>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {languages.map((lang) => (
              <motion.button
                key={lang.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleLangSelect(lang.id)}
                className={`flex items-center p-4 rounded-xl border-2 transition-all text-left group
                  ${
                    selectedLang === lang.id
                      ? "border-[#34b6b3] bg-[#34b6b3]/5 shadow-[0_4px_20px_rgba(52,182,179,0.1)]"
                      : "border-gray-100 hover:border-[#34b6b3]/40 bg-white"
                  }`}
              >
                <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">
                  {lang.flag}
                </span>
                <div>
                  <div
                    className={`font-bold ${selectedLang === lang.id ? "text-[#34b6b3]" : "text-[#1c3553]"}`}
                  >
                    {lang.native}
                  </div>
                  <div className="text-xs text-gray-400">{lang.label}</div>
                </div>
                {selectedLang === lang.id && (
                  <Check size={16} className="ml-auto text-[#34b6b3]" />
                )}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* ── Section 1: Patient ID ────────────────────────────────────────── */}
        <Section
          id={2}
          icon={<IdCard size={18} />}
          title={t("step2_patient_id")}
          subtitle="Enter your existing UHID or register as a new patient"
          isActive={activeSection === 1}
          isCompleted={activeSection > 1}
          isLocked={activeSection < 1}
          onHeaderClick={() => handleHeaderClick(1)}
          summary={
            <span className="font-mono text-[#34b6b3] font-bold">
              {opdState.uhid}
            </span>
          }
        >
          <div className="mt-4 space-y-4 flex flex-col">
            <Input
              label={t("uhid_label")}
              placeholder={t("uhid_placeholder")}
              value={uhidInput}
              onChange={(e) => setUhidInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            <Button
              variant="primary"
              isLoading={verifying}
              onClick={handleVerify}
              className=" mx-auto rounded-xl font-bold shadow-md shadow-[#34b6b3]/30"
            >
              <Search size={18} className="mr-2" />
              {t("uhid_verify")}
            </Button>
            <div className="relative flex items-center justify-center py-2">
              <div className=" border-t border-gray-200 w-40" />
              <span className="shrink-0 mx-4 text-gray-400 text-sm font-bold">
                OR
              </span>
              <div className=" border-t border-gray-200 w-40" />
            </div>
            <Button
              variant="outline"
              icon={<UserPlus size={18} />}
              onClick={handleNewPatient}
              className="mx-auto rounded-xl border-2 border-dashed border-[#34b6b3] text-[#34b6b3] hover:bg-[#34b6b3]/5 font-bold"
            >
              {t("uhid_new_patient")}
            </Button>
            <div className="flex justify-start mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="text"
                size="large"
                onClick={() => next(0)}
                className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
              >
                ← {t("btn_back")}
              </Button>
            </div>
          </div>
        </Section>

        {/* ── Section 2: Capture Mode ─────────────────────────────────────── */}
        <Section
          id={3}
          icon={<ScanLine size={18} />}
          title={t("step3_capture_mode")}
          subtitle="Choose how to fill in patient information"
          isActive={activeSection === 2}
          isCompleted={activeSection > 2}
          isLocked={activeSection < 2}
          onHeaderClick={() => handleHeaderClick(2)}
          summary={
            <span className="capitalize">
              {opdState.captureMode} mode selected
            </span>
          }
        >
          <div className="mt-4 space-y-3">
            {[
              {
                mode: "manual" as CaptureMode,
                icon: <Edit size={15} />,
                titleKey: "capture_mode_manual",
                descKey: "capture_mode_manual_desc",
              },
              {
                mode: "voice" as CaptureMode,
                icon: <Mic size={15} />,
                titleKey: "capture_mode_voice",
                descKey: "capture_mode_voice_desc",
              },
              {
                mode: "image" as CaptureMode,
                icon: <Camera size={15} />,
                titleKey: "capture_mode_image",
                descKey: "capture_mode_image_desc",
              },
            ].map(({ mode, icon, titleKey, descKey }) => {
              const isSelected = opdState.captureMode === mode;
              return (
                <motion.div
                  key={mode}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCaptureMode(mode)}
                  className={`w-96 flex items-center justify-center mx-auto gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${isSelected ? "border-[#34b6b3] bg-[#34b6b3]/5" : "border-gray-100 hover:border-[#34b6b3]/30 bg-white"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${isSelected ? "bg-[#34b6b3] text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-bold ${isSelected ? "text-[#34b6b3]" : "text-[#1c3553]"}`}
                    >
                      {t(titleKey)}
                    </p>
                    <p className="text-sm text-gray-500">{t(descKey)}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? "border-[#34b6b3] bg-[#34b6b3]" : "border-gray-300"}`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 bg-white rounded-full block" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-start mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="text"
              size="large"
              onClick={() => next(1)}
              className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
            >
              ← {t("btn_back")}
            </Button>
          </div>
        </Section>

        {/* ── Section 3: Image Capture (conditional) ──────────────────────── */}
        {opdState.captureMode === "image" && (
          <Section
            id={4}
            icon={<Camera size={18} />}
            title={t("step4_image_capture")}
            subtitle="Upload a document to auto-fill patient details"
            isActive={activeSection === 3}
            isCompleted={activeSection > 3}
            isLocked={activeSection < 3}
            onHeaderClick={() => handleHeaderClick(3)}
            summary={
              <span className="text-[#10b981]">
                Document extracted successfully
              </span>
            }
          >
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {!extracting && !extracted ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Upload
                      onFileSelect={handleFileSelect}
                      accept="image/*,.pdf"
                      className="bg-white"
                    />
                  </motion.div>
                ) : extracting ? (
                  <motion.div
                    key="extracting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-[#34b6b3]/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-[#34b6b3] rounded-full border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-[#34b6b3]">
                        <Loader2 size={24} className="animate-spin" />
                      </div>
                    </div>
                    <p className="font-bold text-[#1c3553]">{t("loading")}</p>
                    <p className="text-[#34b6b3] text-sm animate-pulse">
                      {t("ai_extracting")}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="text-[#10b981]" size={36} />
                    </div>
                    <p className="font-bold text-[#1c3553]">
                      {t("ai_extracted_success")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="text"
                  onClick={() => next(2)}
                  disabled={extracting}
                  className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                >
                  ← {t("btn_back")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => next(4)}
                  disabled={extracting}
                  className="rounded-xl px-6"
                >
                  {t("btn_skip")}
                </Button>
              </div>
            </div>
          </Section>
        )}

        {/* ── Section 4: Demographics ─────────────────────────────────────── */}
        <Section
          id={opdState.captureMode === "image" ? 5 : 4}
          icon={<User size={18} />}
          title={t("step5_demographics")}
          subtitle="Verify and fill in patient details"
          isActive={activeSection === 4}
          isCompleted={activeSection > 4}
          isLocked={activeSection < 4}
          onHeaderClick={() => handleHeaderClick(4)}
          summary={
            <span>
              {opdState.demographics.name &&
                `${opdState.demographics.name} · ${opdState.demographics.age}Y · ${opdState.demographics.gender}`}
            </span>
          }
        >
          <div className="mt-4">
            {opdState.imageExtracted && (
              <Alert
                type="success"
                message="AI Extraction Successful"
                description="Fields pre-filled from document. Please verify."
                className="mb-4"
              />
            )}
            <form
              onSubmit={handleDemoSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Input
                name="name"
                label={`${t("field_name")} *`}
                value={demo.name}
                onChange={handleDemoChange}
                required
                className="md:col-span-2"
              />
              <Input
                name="fatherHusbandName"
                label={t("field_father_husband")}
                value={demo.fatherHusbandName}
                onChange={handleDemoChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  name="age"
                  label={`${t("field_age")} *`}
                  type="number"
                  value={demo.age}
                  onChange={handleDemoChange}
                  required
                  min={0}
                  max={120}
                />
                <Select
                  name="gender"
                  label={`${t("field_gender")} *`}
                  value={demo.gender}
                  onChange={handleDemoChange}
                  required
                  options={[
                    { label: t("field_gender_male"), value: "male" },
                    { label: t("field_gender_female"), value: "female" },
                    { label: t("field_gender_other"), value: "other" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  {t("field_mobile")} *
                </label>
                <div className="flex flex-col gap-2">
                  <Input
                    name="mobile"
                    value={demo.mobile}
                    onChange={handleDemoChange}
                    required
                    maxLength={10}
                    className="flex-1"
                    fullWidth={false}
                  />
                  {/* <Button
                    variant="outline"
                    type="button"
                    className="h-12 rounded-xl whitespace-nowrap"
                  >
                    {t("field_otp_verify")}
                  </Button> */}
                </div>
              </div>
              <Input
                name="address"
                label={t("field_address")}
                multiline
                rows={2}
                value={demo.address}
                onChange={handleDemoChange}
                className="md:col-span-2"
              />
              <div className="md:col-span-2 flex justify-between items-center mt-2">
                <Button
                  variant="text"
                  type="button"
                  onClick={() => next(opdState.captureMode === "image" ? 3 : 2)}
                  className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                >
                  ← {t("btn_back")}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
                >
                  {t("btn_next")}
                </Button>
              </div>
            </form>
          </div>
        </Section>

        {/* ── Section 5: Symptoms ─────────────────────────────────────────── */}
        <Section
          id={opdState.captureMode === "image" ? 6 : 5}
          icon={<Activity size={18} />}
          title={t("step6_symptoms")}
          subtitle="Add symptoms to determine the department"
          isActive={activeSection === 5}
          isCompleted={activeSection > 5}
          isLocked={activeSection < 5}
          onHeaderClick={() => handleHeaderClick(5)}
          summary={
            <span className="flex flex-wrap gap-1 mt-0.5">
              {symptoms.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-xs bg-[#34b6b3]/10 text-[#34b6b3] px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
              {symptoms.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{symptoms.length - 3} more
                </span>
              )}
              {assignedSpecialty && (
                <span className="text-xs font-bold text-[#10b981] ml-1">
                  → {assignedSpecialty}
                </span>
              )}
            </span>
          }
        >
          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  ref={symptomInputRef}
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSymptomHandler(symptomInput);
                    }
                  }}
                  placeholder={t("symptoms_input_placeholder")}
                  className="h-12 pr-12"
                />
                <button
                  onClick={() => addSymptomHandler(symptomInput)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-[#34b6b3]/10 text-[#34b6b3] rounded-lg hover:bg-[#34b6b3] hover:text-white transition-colors"
                >
                  <CornerDownLeft size={16} />
                </button>
              </div>
              <button
                onClick={toggleRecording}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0
                  ${isRecording ? "bg-red-500 text-white animate-pulse shadow-red-500/40 border-none" : "bg-white border-2 border-gray-200 text-gray-500 hover:border-[#34b6b3] hover:text-[#34b6b3]"}`}
              >
                <Mic size={20} />
              </button>
            </div>

            <div className="min-h-[80px] p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              {symptoms.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-4">
                  No symptoms added yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {symptoms.map((s) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Tag
                          closable
                          onClose={() => dispatch(removeSymptom(s))}
                          color="cyan"
                          className="py-1 px-3 text-sm rounded-lg"
                        >
                          {s}
                        </Tag>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => addSymptomHandler(s)}
                  disabled={symptoms.includes(s)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all
                    ${symptoms.includes(s) ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-200 hover:border-[#34b6b3] hover:text-[#34b6b3] cursor-pointer"}`}
                >
                  + {s}
                </button>
              ))}
            </div>

            {assignedSpecialty && symptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4"
              >
                <div>
                  <p className="text-xs font-bold text-[#10b981] uppercase tracking-wide mb-1">
                    Assigned Department
                  </p>
                  <p className="font-bold text-[#1c3553]">
                    {assignedSpecialty}
                  </p>
                  {SUPER_SPECIALTIES.includes(assignedSpecialty) && (
                    <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> Referral required
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Room</p>
                  <p className="font-bold text-[#10b981] font-mono bg-white px-3 py-1 rounded-lg border border-[#10b981]/30">
                    {SPECIALTY_ROOMS[assignedSpecialty]}
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="text"
                onClick={() => next(4)}
                className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
              >
                ← {t("btn_back")}
              </Button>
              <Button
                variant="primary"
                onClick={handleSymptomsNext}
                className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
              >
                {t("btn_next")}
              </Button>
            </div>
          </div>
        </Section>

        {/* ── Section 6: Vitals ───────────────────────────────────────────── */}
        <Section
          id={opdState.captureMode === "image" ? 7 : 6}
          icon={<Heart size={18} />}
          title={t("step7_vitals")}
          subtitle="Record patient vitals (optional)"
          isActive={activeSection === 6}
          isCompleted={activeSection > 6}
          isLocked={activeSection < 6}
          onHeaderClick={() => handleHeaderClick(6)}
          summary={
            <span>
              {[
                opdState.vitals.height && `${opdState.vitals.height}cm`,
                opdState.vitals.weight && `${opdState.vitals.weight}kg`,
                opdState.vitals.pulse && `${opdState.vitals.pulse}bpm`,
              ]
                .filter(Boolean)
                .join(" · ") || "Skipped"}
            </span>
          }
        >
          <form
            onSubmit={handleVitalsSubmit}
            className="mt-4 grid grid-cols-2 gap-4"
          >
            <Input
              name="height"
              label={t("vital_height")}
              type="number"
              value={vitals.height || ""}
              onChange={handleVitalsChange}
              placeholder="e.g. 175"
            />
            <Input
              name="weight"
              label={t("vital_weight")}
              type="number"
              value={vitals.weight || ""}
              onChange={handleVitalsChange}
              placeholder="e.g. 70"
            />
            <div className="col-span-2 border-t border-gray-100 pt-3">
              <label className="block font-bold text-sm text-gray-700 mb-2 ml-1">
                {t("vital_bp")}
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  name="bloodPressureSystolic"
                  type="number"
                  value={vitals.bloodPressureSystolic || ""}
                  onChange={handleVitalsChange}
                  placeholder={t("vital_bp_systolic")}
                  className="text-center"
                />
                <span className="text-gray-400 text-xl">/</span>
                <Input
                  name="bloodPressureDiastolic"
                  type="number"
                  value={vitals.bloodPressureDiastolic || ""}
                  onChange={handleVitalsChange}
                  placeholder={t("vital_bp_diastolic")}
                  className="text-center"
                />
              </div>
            </div>
            <Input
              name="pulse"
              label={t("vital_pulse")}
              type="number"
              value={vitals.pulse || ""}
              onChange={handleVitalsChange}
              placeholder="e.g. 72"
            />
            <Input
              name="temperature"
              label={t("vital_temperature")}
              type="number"
              step="0.1"
              value={vitals.temperature || ""}
              onChange={handleVitalsChange}
              placeholder="e.g. 98.6"
            />
            <Input
              name="spo2"
              label={t("vital_spo2")}
              type="number"
              value={vitals.spo2 || ""}
              onChange={handleVitalsChange}
              placeholder="e.g. 98"
              max={100}
              className="col-span-2"
            />
            <div className="col-span-2 flex justify-between items-center mt-2">
              <Button
                variant="text"
                type="button"
                onClick={() => next(5)}
                className="text-gray-500 hover:text-gray-700 rounded-xl px-0 text-base"
              >
                ← {t("btn_back")}
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="text"
                  type="button"
                  onClick={skipVitals}
                  className="text-gray-500 hover:text-gray-700 rounded-xl"
                >
                  {t("vitals_skip")}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
                >
                  {t("btn_next")}
                </Button>
              </div>
            </div>
          </form>
        </Section>

        {/* ── Section 7: Referral (conditional) ──────────────────────────── */}
        {(showReferral || activeSection >= 7) && (
          <Section
            id={opdState.captureMode === "image" ? 8 : 7}
            icon={<FileCheck size={18} />}
            title={t("step8_referral")}
            subtitle="Upload referral document for super-specialty"
            isActive={activeSection === 7}
            isCompleted={activeSection > 7}
            isLocked={activeSection < 7}
            onHeaderClick={() => handleHeaderClick(7)}
            summary={
              <span
                className={
                  opdState.referralVerified
                    ? "text-[#10b981] font-semibold"
                    : "text-amber-500"
                }
              >
                {opdState.referralVerified
                  ? "Referral verified ✓"
                  : "Pending verification"}
              </span>
            }
          >
            <div className="mt-4">
              {!showReferral && activeSection === 7 && (
                <div className="text-center py-8 text-gray-400">
                  <FileCheck size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="font-medium">
                    Referral not required for your assigned department.
                  </p>
                  <div className="flex justify-between items-center mt-6 max-w-sm mx-auto">
                    <Button
                      variant="text"
                      size="large"
                      onClick={() => next(6)}
                      className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                    >
                      ← {t("btn_back")}
                    </Button>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={() => next(8)}
                      className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
                    >
                      {t("btn_next")}
                    </Button>
                  </div>
                </div>
              )}
              {showReferral && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#1c3553]/5 flex items-center justify-center text-[#1c3553]">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Routing to</p>
                      <p className="font-bold text-[#1c3553]">
                        {opdState.assignedSpecialty}
                      </p>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {!opdState.referralVerified && !referralVerifyingState ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        <Upload
                          onFileSelect={handleReferralFile}
                          accept=".pdf,image/*"
                          className="bg-white"
                        />
                        <div className="relative flex items-center py-1">
                          <div className="flex-grow border-t border-gray-200" />
                          <span className="mx-4 text-gray-400 text-sm font-bold">
                            OR
                          </span>
                          <div className="flex-grow border-t border-gray-200" />
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={referralId}
                            onChange={(e) => setReferralId(e.target.value)}
                            placeholder="e.g. REF-2024-9988"
                            className="flex-1"
                            fullWidth={false}
                          />
                          <Button
                            variant="primary"
                            size="large"
                            onClick={handleReferralVerify}
                            className="h-12 rounded-xl px-4 bg-[#1c3553] hover:bg-[#1c3553]/90 border-none"
                          >
                            Verify
                          </Button>
                        </div>
                        <div className="flex justify-between items-center gap-2 mt-4">
                          <Button
                            variant="text"
                            size="large"
                            onClick={() => next(6)}
                            className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                          >
                            ← {t("btn_back")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => next(8)}
                            className="rounded-xl px-6"
                          >
                            {t("btn_next")}
                          </Button>
                        </div>
                      </motion.div>
                    ) : referralVerifyingState ? (
                      <motion.div
                        key="verifying"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10"
                      >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#34b6b3] mx-auto mb-4" />
                        <p className="font-bold text-[#1c3553]">
                          Verifying Referral...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10"
                      >
                        <div className="w-16 h-16 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="text-[#10b981]" size={36} />
                        </div>
                        <p className="font-bold text-[#1c3553]">
                          {t("referral_verified")}
                        </p>
                        <div className="flex justify-between items-center mt-6 max-w-sm mx-auto">
                          <Button
                            variant="text"
                            size="large"
                            onClick={() => next(6)}
                            className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                          >
                            ← {t("btn_back")}
                          </Button>
                          <Button
                            variant="primary"
                            size="large"
                            onClick={() => next(8)}
                            className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
                          >
                            {t("btn_next")}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </Section>
        )}

        {/* ── Section 8: Review & Submit ──────────────────────────────────── */}
        <Section
          id={opdState.captureMode === "image" ? 9 : showReferral ? 9 : 8}
          icon={<ClipboardList size={18} />}
          title={t("step9_review")}
          subtitle="Review all details before submitting"
          isActive={activeSection === 8}
          isCompleted={false}
          isLocked={activeSection < 8}
          onHeaderClick={() => handleHeaderClick(8)}
        >
          <div className="mt-4 space-y-6">
            {/* Patient header */}
            <div className="bg-[#34b6b3]/5 rounded-xl p-4 flex justify-between items-center border border-[#34b6b3]/10">
              <div>
                <p className="text-xs font-bold text-[#34b6b3] uppercase tracking-wide mb-0.5">
                  {opdState.isNewPatient ? "New Patient" : "Existing Patient"}
                </p>
                <p className="font-mono font-bold text-[#1c3553] text-lg">
                  {opdState.uhid}
                </p>
              </div>
              <Tag color="cyan" className="rounded-lg px-3 py-1 text-xs m-0">
                Mode: {opdState.captureMode}
              </Tag>
            </div>

            {/* Demographics */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
                  <User size={16} className="text-[#34b6b3]" />
                  {t("review_demographics")}
                </h4>
                <button
                  onClick={() => setActiveSection(4)}
                  className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
                >
                  <Edit size={12} />
                  {t("review_edit")}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {[
                  ["Name", opdState.demographics.name],
                  ["Age", `${opdState.demographics.age} Yrs`],
                  ["Gender", opdState.demographics.gender],
                  ["Mobile", opdState.demographics.mobile],
                  ["Address", opdState.demographics.address],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className={`py-1.5 border-b border-gray-50 ${label === "Address" ? "col-span-2" : ""}`}
                  >
                    <span className="text-gray-400 mr-2">{label}:</span>
                    <span className="font-semibold text-[#1c3553]">
                      {value || <span className="text-gray-300 italic">—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
                  <Activity size={16} className="text-[#34b6b3]" />
                  {t("review_symptoms")}
                </h4>
                <button
                  onClick={() => setActiveSection(5)}
                  className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
                >
                  <Edit size={12} />
                  {t("review_edit")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {opdState.symptoms.length > 0 ? (
                  opdState.symptoms.map((s) => (
                    <Tag
                      key={s}
                      className="text-xs bg-gray-50 border-gray-200 text-gray-700 rounded-md px-3 py-1 m-0"
                    >
                      {s}
                    </Tag>
                  ))
                ) : (
                  <span className="text-gray-300 italic text-sm">
                    None recorded
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between bg-[#10b981]/10 rounded-lg px-3 py-2">
                <p className="font-bold text-[#1c3553] text-sm">
                  {opdState.assignedSpecialty}
                </p>
                <p className="font-bold text-[#10b981] font-mono text-sm">
                  {opdState.roomNumber}
                </p>
              </div>
            </div>

            {/* Vitals */}
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
                  <Heart size={16} className="text-[#34b6b3]" />
                  {t("review_vitals")}
                </h4>
                <button
                  onClick={() => setActiveSection(6)}
                  className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
                >
                  <Edit size={12} />
                  {t("review_edit")}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {[
                  [
                    "Height",
                    opdState.vitals.height
                      ? `${opdState.vitals.height} cm`
                      : "—",
                  ],
                  [
                    "Weight",
                    opdState.vitals.weight
                      ? `${opdState.vitals.weight} kg`
                      : "—",
                  ],
                  [
                    "BP",
                    opdState.vitals.bloodPressureSystolic
                      ? `${opdState.vitals.bloodPressureSystolic}/${opdState.vitals.bloodPressureDiastolic}`
                      : "—",
                  ],
                  [
                    "Pulse",
                    opdState.vitals.pulse
                      ? `${opdState.vitals.pulse} bpm`
                      : "—",
                  ],
                  [
                    "Temp",
                    opdState.vitals.temperature
                      ? `${opdState.vitals.temperature} °F`
                      : "—",
                  ],
                  [
                    "SpO2",
                    opdState.vitals.spo2 ? `${opdState.vitals.spo2}%` : "—",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100"
                  >
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p
                      className={`font-bold ${value === "—" ? "text-gray-300" : "text-[#1c3553]"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral */}
            {opdState.referralRequired && (
              <div className="border border-amber-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
                    <FileCheck size={16} className="text-[#34b6b3]" />
                    {t("review_referral")}
                  </h4>
                  <button
                    onClick={() => setActiveSection(7)}
                    className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
                  >
                    <Edit size={12} />
                    {t("review_edit")}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {opdState.referralVerified ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                      <span className="text-[#10b981] font-semibold">
                        Referral Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-amber-400 text-amber-400 flex items-center justify-center font-bold text-xs">
                        !
                      </div>
                      <span className="text-amber-500 font-medium">
                        Referral Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between gap-4 mt-6">
              <Button
                variant="text"
                onClick={() => next(opdState.referralRequired ? 7 : 6)}
                className="rounded-xl px-0 text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                ← {t("btn_back")}
              </Button>
              <Button
                variant="primary"
                isLoading={submitting}
                onClick={handleSubmit}
                disabled={
                  opdState.referralRequired && !opdState.referralVerified
                }
                className="rounded-xl h-14 font-bold text-base shadow-lg shadow-[#34b6b3]/40 bg-gradient-to-r from-[#34b6b3] to-[#0da0b8] border-none"
              >
                {t("review_confirm")}
              </Button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
