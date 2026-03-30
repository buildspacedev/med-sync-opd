import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Edit, Mic, Camera } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCaptureMode } from "@/redux/opdSlice";
import { CaptureMode } from "@/types/opd";

export default function CaptureModeSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.opd.captureMode);

  const handleSelectMode = (mode: CaptureMode) => {
    dispatch(setCaptureMode(mode));

    if (mode === "image") {
      navigate({ to: "/opd/image-capture" });
    } else {
      navigate({ to: "/opd/demographics" });
    }
  };

  const getModeCard = (
    mode: CaptureMode,
    icon: React.ReactNode,
    titleKey: string,
    descKey: string,
  ) => {
    const isSelected = currentMode === mode;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSelectMode(mode)}
        className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all flex items-center gap-5 group shadow-sm
          ${
            isSelected
              ? "border-[#34b6b3] bg-[#34b6b3]/5 shadow-[0_8px_30px_rgba(52,182,179,0.12)]"
              : "border-gray-100 hover:border-[#34b6b3]/30 hover:shadow-md"
          }`}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors
          ${isSelected ? "bg-[#34b6b3] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-[#34b6b3]/20 group-hover:text-[#34b6b3]"}`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <h3
            className={`text-xl font-bold mb-1 ${isSelected ? "text-[#34b6b3]" : "text-[#1c3553]"}`}
          >
            {t(titleKey)}
          </h3>
          <p className="text-gray-500 text-sm">{t(descKey)}</p>
        </div>

        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${isSelected ? "border-[#34b6b3] bg-[#34b6b3]" : "border-gray-300"}`}
        >
          {isSelected && (
            <span className="w-2.5 h-2.5 bg-white rounded-full block" />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col pt-10"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("capture_mode_title")}
        </h2>
        <div className="w-20 h-1 bg-[#34b6b3] mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 gap-5 max-w-2xl mx-auto w-full">
        {getModeCard(
          "manual",
          <Edit size={24} />,
          "capture_mode_manual",
          "capture_mode_manual_desc",
        )}

        {getModeCard(
          "voice",
          <Mic size={24} />,
          "capture_mode_voice",
          "capture_mode_voice_desc",
        )}

        {getModeCard(
          "image",
          <Camera size={24} />,
          "capture_mode_image",
          "capture_mode_image_desc",
        )}
      </div>

      <div className="mt-auto pt-10 pb-4 flex justify-between mx-auto w-full max-w-2xl">
        <Button
          size="large"
          variant="outline"
          onClick={() => navigate({ to: "/opd/patient-id" })}
          className="rounded-xl px-8"
        >
          {t("btn_back")}
        </Button>
      </div>
    </motion.div>
  );
}
