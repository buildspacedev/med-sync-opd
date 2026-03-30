import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import { Mic, CornerDownLeft, X, Activity, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addSymptom,
  removeSymptom,
  setSpecialty,
  setReferralRequired,
} from "@/redux/opdSlice";
import { Specialty, SPECIALTY_ROOMS, SUPER_SPECIALTIES } from "@/types/opd";

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

  const sText = symptoms.join(" ").toLowerCase();

  if (sText.includes("chest pain") || sText.includes("heart"))
    return "Cardiology";
  if (sText.includes("stomach") || sText.includes("vomiting"))
    return "Gastrointestinal Surgery";
  if (sText.includes("joint") || sText.includes("bone")) return "Orthopaedics";
  if (sText.includes("skin") || sText.includes("rash"))
    return "Dermatology & Venereology";
  if (sText.includes("vision") || sText.includes("eye")) return "Ophthalmology";
  if (sText.includes("ear") || sText.includes("throat")) return "ENT";
  if (sText.includes("sugar") || sText.includes("diabetes"))
    return "Endocrinology, Metabolism & Diabetes";

  return "General Medicine";
};

export default function SymptomsAndRouting() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const symptoms = useAppSelector((state) => state.opd.symptoms);
  const assignedSpecialty = useAppSelector(
    (state) => state.opd.assignedSpecialty,
  );

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (symptoms.length > 0) {
      const specialty = mapSymptomsToSpecialty(symptoms);
      const room = SPECIALTY_ROOMS[specialty];

      dispatch(setSpecialty({ specialty, room }));

      const isSuperSpecialty = SUPER_SPECIALTIES.includes(specialty);
      dispatch(setReferralRequired(isSuperSpecialty));
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

  const handleAddSymptom = (symptom: string) => {
    if (symptom.trim() && !symptoms.includes(symptom.trim())) {
      dispatch(addSymptom(symptom.trim()));
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSymptom(inputValue);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        handleAddSymptom("Severe Headache");
      }, 3000);
    }
  };

  const handleNext = () => {
    navigate({ to: "/opd/vitals" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col pt-10 pb-24 h-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("symptoms_title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("symptoms_subtitle")}</p>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-1 gap-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative mb-4">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("symptoms_input_placeholder")}
                className="h-14 pr-12 text-lg"
              />
              <button
                onClick={() => handleAddSymptom(inputValue)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#34b6b3]/10 text-[#34b6b3] rounded-lg hover:bg-[#34b6b3] hover:text-white transition-colors"
              >
                <CornerDownLeft size={18} />
              </button>
            </div>

            <button
              onClick={toggleRecording}
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all shadow-sm
                ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse shadow-red-500/40 border-none"
                    : "bg-white border-2 border-gray-200 text-gray-500 hover:border-[#34b6b3] hover:text-[#34b6b3]"
                }`}
            >
              <Mic size={24} />
            </button>
          </div>

          <div className="mb-8 min-h-[100px] p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            {symptoms.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>No symptoms added yet.</p>
                <p className="text-sm">
                  Type above or select from suggestions below.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {symptoms.map((s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Tag
                        closable
                        onClose={() => dispatch(removeSymptom(s))}
                        color="cyan"
                        className="py-1.5 px-3 text-sm rounded-lg"
                      >
                        {s}
                      </Tag>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3">
              {t("symptoms_suggest")}
            </p>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((s) => (
                <button
                  key={s}
                  onClick={() => handleAddSymptom(s)}
                  disabled={symptoms.includes(s)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all
                    ${
                      symptoms.includes(s)
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#34b6b3] hover:text-[#34b6b3] shadow-sm cursor-pointer"
                    }`}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {assignedSpecialty && symptoms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="rounded-3xl border-2 border-[#10b981] bg-[#10b981]/5 shadow-[0_10px_30px_rgba(16,185,129,0.1)] overflow-hidden">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#10b981] text-white flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Activity size={32} />
                </div>

                <div className="flex-1">
                  <p className="text-[#10b981] font-semibold text-sm mb-1 uppercase tracking-wider">
                    {t("symptoms_assigned")}
                  </p>
                  <h3 className="text-2xl font-bold text-[#1c3553]">
                    {assignedSpecialty}
                  </h3>
                </div>

                <div className="text-right border-l-2 border-[#10b981]/20 pl-6 py-2">
                  <p className="text-gray-500 font-medium text-sm mb-1">
                    {t("symptoms_room")}
                  </p>
                  <p className="text-xl font-bold text-[#10b981] bg-white px-3 py-1 rounded-lg border border-[#10b981]/30 inline-block font-mono">
                    {SPECIALTY_ROOMS[assignedSpecialty]}
                  </p>
                </div>
              </div>

              {SUPER_SPECIALTIES.includes(assignedSpecialty) && (
                <div className="mt-4 pt-4 border-t border-[#10b981]/20">
                  <p className="text-[#f59e0b] font-medium text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    This super-specialty department requires a valid referral
                    document on the next step.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-8 z-10 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto w-full flex justify-between">
          <Button
            size="large"
            variant="outline"
            onClick={() => navigate({ to: "/opd/demographics" })}
            className="rounded-xl px-8 h-12"
          >
            {t("btn_back")}
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={handleNext}
            className="rounded-xl px-10 h-12 font-bold shadow-md shadow-[#34b6b3]/30"
          >
            {t("btn_next")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
