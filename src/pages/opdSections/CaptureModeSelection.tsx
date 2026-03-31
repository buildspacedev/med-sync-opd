import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Edit, Mic, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCaptureMode } from "@/redux/opdSlice";
import { CaptureMode } from "@/types/opd";

export function CaptureModeSelection({ 
  next, 
  prev 
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void 
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((s) => s.opd);

  const handleCaptureMode = (mode: CaptureMode) => {
    dispatch(setCaptureMode(mode));
    if (mode === "image") next(3); // go to image capture
    else next(4); // skip to demographics
  };

  return (
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
            className={`w-full max-w-sm flex items-center justify-center mx-auto gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
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
      
      <div className="flex justify-start mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="text"
          size="large"
          onClick={() => prev(1)}
          className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
        >
          ← {t("btn_back")}
        </Button>
      </div>
    </div>
  );
}
