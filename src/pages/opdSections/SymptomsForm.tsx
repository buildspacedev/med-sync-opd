import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { CornerDownLeft, Mic, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addSymptom,
  removeSymptom,
  setSpecialty,
  setReferralRequired,
} from "@/redux/opdSlice";
import { Specialty, SPECIALTY_ROOMS, SUPER_SPECIALTIES } from "@/types/opd";

export const commonSymptoms = [
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

export const mapSymptomsToSpecialty = (symptoms: string[]): Specialty => {
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

export function SymptomsForm({ 
  next, 
  prev 
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void 
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((s) => s.opd);
  const symptoms = opdState.symptoms;
  const assignedSpecialty = opdState.assignedSpecialty;

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
    next(6); // vitals
  };

  return (
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

      <div className="flex justify-between items-center mt-2">
        <Button
          variant="text"
          onClick={() => prev(4)}
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
  );
}
