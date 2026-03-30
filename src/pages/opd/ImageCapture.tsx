import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Upload } from "@/components/ui/Upload";
import { useToast } from "@/components/ui/Toast";
import {
  CheckCircle2,
  Loader2,
  Upload as UploadIcon,
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setDemographics, setImageExtracted } from "@/redux/opdSlice";

export default function ImageCapture() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (file: File) => {
    setExtracting(true);

    setTimeout(() => {
      setExtracting(false);
      setSuccess(true);
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

      setTimeout(() => {
        navigate({ to: "/opd/demographics" });
      }, 2000);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col pt-10"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("capture_mode_image")}
        </h2>
        <p className="text-gray-500 text-lg">{t("capture_mode_image_desc")}</p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!extracting && !success ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#34b6b3]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#34b6b3] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#34b6b3]">
                  <Loader2 size={32} className="animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#1c3553] mb-2">
                {t("loading")}
              </h3>
              <p className="text-[#34b6b3] font-medium animate-pulse">
                {t("ai_extracting")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-[#10b981]" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-[#1c3553] mb-2">
                {t("ai_extracted_success")}
              </h3>
              <p className="text-gray-500">
                Redirecting to demographics verification...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-10 pb-4 flex justify-between max-w-2xl mx-auto w-full">
        <Button
          size="large"
          variant="outline"
          onClick={() => navigate({ to: "/opd/capture-mode" })}
          disabled={extracting}
          className="rounded-xl px-8"
        >
          {t("btn_back")}
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate({ to: "/opd/demographics" })}
          disabled={extracting || success}
          className="rounded-xl px-8"
        >
          {t("btn_skip")}
        </Button>
      </div>
    </motion.div>
  );
}
