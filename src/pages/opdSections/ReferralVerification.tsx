import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { FileCheck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Upload } from "@/components/ui/Upload";
import { useToast } from "@/components/ui/Toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setReferralVerified } from "@/redux/opdSlice";

export function ReferralVerification({ 
  next, 
  prev,
  activeSection
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void;
  activeSection: number;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const opdState = useAppSelector((s) => s.opd);
  
  const showReferral = opdState.referralRequired;
  
  const [referralVerifyingState, setReferralVerifyingState] = useState(false);
  const [referralId, setReferralId] = useState("");

  const handleReferralVerify = () => {
    setReferralVerifyingState(true);
    setTimeout(() => {
      setReferralVerifyingState(false);
      dispatch(setReferralVerified(true));
      toast(t("referral_verified"), "success");
      setTimeout(() => next(8), 1000);
    }, 1500);
  };

  const handleReferralFile = (_file: File) => handleReferralVerify();

  return (
    <div className="mt-4">
      {!showReferral && activeSection === 7 && (
        <div className="text-center py-8 text-gray-400">
          <FileCheck size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">
            Referral not required for your assigned department.
          </p>
          <div className="flex justify-between items-center mt-6 max-w-sm mx-auto">
            <Button
              variant="text"
              size="large"
              onClick={() => prev(6)}
              className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
            >
              ← {t("btn_back")}
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={() => next(8)}
              className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
            >
              {t("btn_next")}
            </Button>
          </div>
        </div>
      )}
      {showReferral && (
        <>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#1c3553]/5 flex items-center justify-center text-[#1c3553]">
              <FileCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Routing to</p>
              <p className="font-bold text-[#1c3553]">
                {opdState.assignedSpecialty}
              </p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {!opdState.referralVerified && !referralVerifyingState ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Upload
                  onFileSelect={handleReferralFile}
                  accept=".pdf,image/*"
                  className="bg-white"
                />
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-4 text-gray-400 text-sm font-bold">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>
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
                    onClick={handleReferralVerify}
                    className="h-12 rounded-xl px-4 bg-[#1c3553] hover:bg-[#1c3553]/90 border-none"
                  >
                    Verify
                  </Button>
                </div>
                <div className="flex justify-between items-center gap-2 mt-4">
                  <Button
                    variant="text"
                    size="large"
                    onClick={() => prev(6)}
                    className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                  >
                    ← {t("btn_back")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => next(8)}
                    className="rounded-xl px-6"
                  >
                    {t("btn_next")}
                  </Button>
                </div>
              </motion.div>
            ) : referralVerifyingState ? (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#34b6b3] mx-auto mb-4" />
                <p className="font-bold text-[#1c3553]">
                  Verifying Referral...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-[#10b981]" size={36} />
                </div>
                <p className="font-bold text-[#1c3553]">
                  {t("referral_verified")}
                </p>
                <div className="flex justify-between items-center mt-6 max-w-sm mx-auto">
                  <Button
                    variant="text"
                    size="large"
                    onClick={() => prev(6)}
                    className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
                  >
                    ← {t("btn_back")}
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => next(8)}
                    className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
                  >
                    {t("btn_next")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
