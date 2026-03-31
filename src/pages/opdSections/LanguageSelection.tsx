import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { setUserLocale } from "@/redux/locale";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLanguage } from "@/redux/opdSlice";
import { Language } from "@/types/opd";

export const languages: {
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

export function LanguageSelection({ next }: { next: (n: number) => void }) {
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((s) => s.opd);
  const [selectedLang, setSelectedLang] = useState<Language>(opdState.language);
  const [, startLangTransition] = useTransition();

  const handleLangSelect = (lang: Language) => {
    setSelectedLang(lang);
    dispatch(setLanguage(lang));
    startLangTransition(() => {
      setUserLocale(lang).then(() => next(1));
    });
  };

  return (
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
  );
}
