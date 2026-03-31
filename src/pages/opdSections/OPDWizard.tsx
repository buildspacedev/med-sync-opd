import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { useAppSelector } from "@/redux/hooks";
import {
  Globe,
  IdCard,
  Camera,
  ScanLine,
  User,
  Activity,
  Heart,
  FileCheck,
  ClipboardList,
  Check,
  ChevronDown,
} from "lucide-react";

import { LanguageSelection, languages } from "./LanguageSelection";
import { PatientIdVerification } from "./PatientIdVerification";
import { CaptureModeSelection } from "./CaptureModeSelection";
import { ImageCapture } from "./ImageCapture";
import { DemographicsForm } from "./DemographicsForm";
import { SymptomsForm } from "./SymptomsForm";
import { VitalsForm } from "./VitalsForm";
import { ReferralVerification } from "./ReferralVerification";
import { ReviewSection } from "./ReviewSection";

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
  const opdState = useAppSelector((s) => s.opd);

  const [activeSection, setActiveSection] = useState(0);

  const next = (n: number) => setActiveSection(n);
  const prev = (n: number) => setActiveSection(n);

  const handleHeaderClick = (sectionId: number) => {
    if (sectionId < activeSection) setActiveSection(sectionId);
  };

  const showReferral = opdState.referralRequired;
  const totalSections = showReferral ? 9 : 8; 
  const progress = Math.round((activeSection / (totalSections - 1)) * 100);

  const LANG_LABELS = languages.find((l) => l.id === opdState.language);

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
          <LanguageSelection next={next} />
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
          <PatientIdVerification next={next} prev={prev} />
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
          <CaptureModeSelection next={next} prev={prev} />
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
            <ImageCapture next={next} prev={prev} />
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
          <DemographicsForm next={next} prev={prev} />
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
              {opdState.symptoms.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-xs bg-[#34b6b3]/10 text-[#34b6b3] px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
              {opdState.symptoms.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{opdState.symptoms.length - 3} more
                </span>
              )}
              {opdState.assignedSpecialty && (
                <span className="text-xs font-bold text-[#10b981] ml-1">
                  → {opdState.assignedSpecialty}
                </span>
              )}
            </span>
          }
        >
          <SymptomsForm next={next} prev={prev} />
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
          <VitalsForm next={next} prev={prev} />
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
            <ReferralVerification next={next} prev={prev} activeSection={activeSection} />
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
          <ReviewSection setActiveSection={setActiveSection} next={next} prev={prev} />
        </Section>
      </div>
    </div>
  );
}
