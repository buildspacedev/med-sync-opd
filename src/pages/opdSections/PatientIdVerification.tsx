import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUHID } from "@/redux/opdSlice";

export function PatientIdVerification({ 
  next, 
  prev 
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void 
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((s) => s.opd);
  const { toast } = useToast();

  const [uhidInput, setUhidInput] = useState(opdState.uhid);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    if (!uhidInput.trim()) {
      toast(t("error_uhid_invalid"), "warning");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      const isExisting = uhidInput.toUpperCase().startsWith("UHID-1");
      if (isExisting) {
        toast(t("uhid_existing"), "success");
        dispatch(setUHID({ uhid: uhidInput.toUpperCase(), isNew: false }));
      } else {
        toast(t("uhid_not_found"), "info");
        dispatch(setUHID({ uhid: uhidInput.toUpperCase(), isNew: true }));
      }
      setVerifying(false);
      next(2);
    }, 800);
  };

  const handleNewPatient = () => {
    const newUhid = `UHID-NEW-${Math.floor(Math.random() * 10000)}`;
    dispatch(setUHID({ uhid: newUhid, isNew: true }));
    toast(t("uhid_new"), "success");
    next(2);
  };

  return (
    <div className="mt-4 space-y-4 flex flex-col">
      <Input
        label={t("uhid_label")}
        placeholder={t("uhid_placeholder")}
        value={uhidInput}
        onChange={(e) => setUhidInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleVerify()}
      />
      <Button
        variant="primary"
        isLoading={verifying}
        onClick={handleVerify}
        className="mx-auto rounded-xl font-bold shadow-md shadow-[#34b6b3]/30"
      >
        <Search size={18} className="mr-2" />
        {t("uhid_verify")}
      </Button>
      <div className="relative flex items-center justify-center py-2">
        <div className="border-t border-gray-200 flex-1" />
        <span className="shrink-0 mx-4 text-gray-400 text-sm font-bold">
          OR
        </span>
        <div className="border-t border-gray-200 flex-1" />
      </div>
      <Button
        variant="outline"
        icon={<UserPlus size={18} />}
        onClick={handleNewPatient}
        className="mx-auto rounded-xl border-2 border-dashed border-[#34b6b3] text-[#34b6b3] hover:bg-[#34b6b3]/5 font-bold"
      >
        {t("uhid_new_patient")}
      </Button>
      <div className="flex justify-start mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="text"
          size="large"
          onClick={() => prev(0)}
          className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
        >
          ← {t("btn_back")}
        </Button>
      </div>
    </div>
  );
}
