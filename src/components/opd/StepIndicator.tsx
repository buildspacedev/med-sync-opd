import { useRouterState } from "@tanstack/react-router";
import { Check } from "lucide-react";

const steps = [
  { id: 1, path: "/opd", label: "step1_language" },
  { id: 2, path: "/opd/patient-id", label: "step2_patient_id" },
  { id: 3, path: "/opd/capture-mode", label: "step3_capture_mode" },
  { id: 4, path: "/opd/image-capture", label: "step4_image_capture" },
  { id: 5, path: "/opd/demographics", label: "step5_demographics" },
  { id: 6, path: "/opd/symptoms", label: "step6_symptoms" },
  { id: 7, path: "/opd/vitals", label: "step7_vitals" },
  { id: 8, path: "/opd/referral", label: "step8_referral" },
  { id: 9, path: "/opd/review", label: "step9_review" },
  { id: 10, path: "/opd/opd-card", label: "step10_opd_card" },
];

export function StepIndicator({ translations }: { translations: Record<string, string> }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="w-full py-6 px-4 bg-white/50 backdrop-blur-sm border-b border-gray-100 hidden md:block">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background line */}
          <div className="absolute top-4 left-6 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2 rounded-full w-275" />

          {/* Active progress bar */}
          <div
            className="absolute top-4 left-6 h-0.5 bg-[#34b6b3] -z-10 -translate-y-1/2 rounded-full transition-all duration-500 w-275"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <div key={step.id} className="flex flex-col items-center relative gap-2 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300
                    ${
                      isCompleted
                        ? "bg-[#10b981] text-white shadow-md shadow-[#10b981]/20"
                        : isActive
                        ? "bg-[#34b6b3] text-white shadow-lg shadow-[#34b6b3]/30 ring-4 ring-[#34b6b3]/20"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>

                <div className="absolute top-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:opacity-100 md:relative md:top-0">
                  <span
                    className={`text-xs font-medium max-w-20 text-center block
                      ${isActive ? "text-[#34b6b3]" : "text-gray-400"}`}
                  >
                    {translations[step.label] || step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
