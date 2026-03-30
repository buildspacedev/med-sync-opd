import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Upload } from "@/components/ui/Upload";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  FileCheck,
  CheckCircle2,
  Upload as UploadIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setReferralVerified } from "@/redux/opdSlice";

export default function ReferralValidation() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const assignedSpecialty = useAppSelector(
    (state) => state.opd.assignedSpecialty,
  );
  const referralVerified = useAppSelector(
    (state) => state.opd.referralVerified,
  );

  const [verifying, setVerifying] = useState(false);
  const [referralId, setReferralId] = useState("");

  const handleVerification = () => {
    setVerifying(true);

    setTimeout(() => {
      setVerifying(false);
      dispatch(setReferralVerified(true));
      toast(t("referral_verified"), "success");

      setTimeout(() => {
        navigate({ to: "/opd/review" });
      }, 1500);
    }, 1500);
  };

  const handleFileSelect = (file: File) => {
    handleVerification();
  };

  const handleIdSubmit = () => {
    if (!referralId.trim()) {
      toast("Please enter a valid Referral ID", "warning");
      return;
    }
    handleVerification();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col pt-10"
    >
      <div className="text-center mb-8">
        <div className="inline-block bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-1.5 rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
          Super Specialty Admission
        </div>
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("referral_title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("referral_subtitle")}</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-[#1c3553]/5 flex items-center justify-center text-[#1c3553]">
            <FileCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Routing to</p>
            <p className="text-lg font-bold text-[#1c3553]">
              {assignedSpecialty}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!referralVerified && !verifying ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <Upload
                onFileSelect={handleFileSelect}
                accept=".pdf,image/*"
                className="bg-white"
              />

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="shrink-0 mx-4 text-gray-400 text-sm font-bold">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                <label className="text-sm font-bold text-text-primary ml-1">
                  {t("referral_enter_id")}
                </label>
                <div className="flex gap-2">
                  <Input
                    value={referralId}
                    onChange={(e) => setReferralId(e.target.value)}
                    placeholder="e.g. REF-2024-9988"
                    className="flex-1"
                    fullWidth={false}
                  />
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleIdSubmit}
                    className="h-12 rounded-xl px-6 bg-[#1c3553] hover:bg-[#1c3553]/90 border-none"
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : verifying ? (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#34b6b3] mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-[#1c3553] mb-2">
                Verifying Referral...
              </h3>
              <p className="text-gray-500">Connecting to hospital database</p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-[#10b981]" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-[#1c3553] mb-2">
                {t("referral_verified")}
              </h3>
              <p className="text-gray-500">Redirecting to review step...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-4 pb-4 flex justify-between max-w-2xl mx-auto w-full">
        <Button
          size="large"
          variant="outline"
          onClick={() => navigate({ to: "/opd/vitals" })}
          disabled={verifying}
          className="rounded-xl px-8"
        >
          {t("btn_back")}
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate({ to: "/opd/review" })}
          disabled={verifying || !referralVerified}
          className="rounded-xl px-10 shadow-md shadow-[#34b6b3]/30"
        >
          {t("btn_next")}
        </Button>
      </div>
    </motion.div>
  );
}
