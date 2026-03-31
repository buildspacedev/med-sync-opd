import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Upload } from "@/components/ui/Upload";
import { useToast } from "@/components/ui/Toast";
import { useAppDispatch } from "@/redux/hooks";
import { setDemographics, setImageExtracted } from "@/redux/opdSlice";

export function ImageCapture({ 
  next, 
  prev 
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void 
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

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

  return (
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
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="text"
          onClick={() => prev(2)}
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
  );
}
