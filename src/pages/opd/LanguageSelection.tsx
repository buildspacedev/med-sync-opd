import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLanguage } from "@/redux/opdSlice";
import { Language } from "@/types/opd";
import { setUserLocale } from "@/redux/locale";

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

export default function LanguageSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.opd.language);
  const [isPending, startTransition] = useTransition();
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang);

    // 1. Update Redux store
    dispatch(setLanguage(lang));

    // 2. Update locale persistence
    startTransition(() => {
      setUserLocale(lang).then(() => {
        // 3. Move to next step
        navigate({ to: "/opd/patient-id" });
      });
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-gray-100 text-center"
      >
        <div className="w-16 h-16 bg-[#34b6b3]/10 text-[#34b6b3] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("language_select_title")}
        </h2>
        <p className="text-gray-500 mb-10 text-lg">
          {t("language_select_subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((lang, index) => {
            const isSelected = selectedLang === lang.id;

            return (
              <motion.button
                key={lang.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleLanguageSelect(lang.id)}
                disabled={isPending}
                className={`flex items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group
                  ${
                    isSelected
                      ? "border-[#34b6b3] bg-[#34b6b3]/5 shadow-[0_8px_30px_rgba(52,182,179,0.12)]"
                      : "border-gray-100 hover:border-[#34b6b3]/50 hover:bg-gray-50 bg-white"
                  }
                  ${isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#34b6b3]">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">
                  {lang.flag}
                </span>
                <div>
                  <div
                    className={`text-xl font-bold mb-1 ${isSelected ? "text-[#34b6b3]" : "text-[#1c3553]"}`}
                  >
                    {lang.native}
                  </div>
                  <div className="text-gray-500 text-sm font-medium">
                    {lang.label}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {isPending && (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#34b6b3]"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
