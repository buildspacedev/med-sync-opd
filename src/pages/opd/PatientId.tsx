import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Search, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUHID } from "@/redux/opdSlice";
import { usePatientQuery } from "@/api/patients";

export default function PatientId() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUhid = useAppSelector((state) => state.opd.uhid);

  const [uhidInput, setUhidInput] = useState(currentUhid);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!uhidInput.trim()) {
      toast(t("error_uhid_invalid"), "warning");
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      const isExisting = uhidInput.toUpperCase().startsWith("UHID-1");

      if (isExisting) {
        toast(t("uhid_existing"), "success");
        dispatch(setUHID({ uhid: uhidInput.toUpperCase(), isNew: false }));
      } else {
        toast(t("uhid_not_found"), "info");
        dispatch(setUHID({ uhid: uhidInput.toUpperCase(), isNew: true }));
      }

      navigate({ to: "/opd/capture-mode" });
      setIsVerifying(false);
    }, 1000);
  };

  const handleNewPatient = () => {
    const newUhid = `UHID-NEW-${Math.floor(Math.random() * 10000)}`;
    dispatch(setUHID({ uhid: newUhid, isNew: true }));
    toast(t("uhid_new"), "success");
    navigate({ to: "/opd/capture-mode" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full pt-10"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("uhid_title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("uhid_subtitle")}</p>
      </div>

      <Card className="shadow-lg border-gray-100 rounded-2xl overflow-hidden mb-6 p-6">
        <div className="flex flex-col gap-4">
          <Input
            label={t("uhid_label")}
            placeholder={t("uhid_placeholder")}
            value={uhidInput}
            onChange={(e) => setUhidInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-lg"
          />

          <Button
            variant="primary"
            size="large"
            isLoading={isVerifying}
            onClick={handleVerify}
            className="w-full rounded-xl h-12 text-base font-bold shadow-md shadow-[#34b6b3]/30"
          >
            {t("uhid_verify")}
          </Button>
        </div>
      </Card>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="shrink-0 mx-4 text-gray-400 text-sm font-bold">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <Button
        variant="outline"
        size="large"
        icon={<UserPlus size={20} />}
        onClick={handleNewPatient}
        className="w-full rounded-xl h-14 text-base font-bold border-2 border-dashed border-[#34b6b3] text-[#34b6b3] hover:bg-[#34b6b3]/5"
      >
        {t("uhid_new_patient")}
      </Button>

      <div className="mt-auto pt-10 pb-4 flex justify-between">
        <Button
          size="large"
          variant="outline"
          onClick={() => navigate({ to: "/opd" })}
          className="rounded-xl px-8"
        >
          {t("btn_back")}
        </Button>
      </div>
    </motion.div>
  );
}
