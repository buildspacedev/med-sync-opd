import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import {
  Printer,
  Home,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { resetSession } from "@/redux/opdSlice";

export default function OPDCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((state) => state.opd);

  const visitId = opdState.visitId || "OPD-2024-998877";

  const handlePrint = () => {
    window.print();
  };

  const handleHome = () => {
    dispatch(resetSession());
    navigate({ to: "/opd" });
  };

  return (
    <div className="flex-1 flex flex-col pt-6 pb-24 items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-center mb-8 no-print"
      >
        <div className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-[6px] border-white shadow-lg animate-pulse-ring">
          <CheckCircle2 className="text-[#10b981]" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-[#1c3553] mb-2">
          {t("opd_card_title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("opd_card_subtitle")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(28,53,83,0.08)] border border-gray-100 overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none"
        id="printable-card"
      >
        <div className="bg-[#34b6b3] text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                Med-Sync Hospital
              </p>
              <h3 className="text-2xl font-bold tracking-tight">OPD Card</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/20">
              Valid Today
            </div>
          </div>
        </div>

        <div className="p-6 relative">
          <div className="mb-6">
            <h4 className="text-2xl font-bold text-[#1c3553] mb-1">
              {opdState.demographics.name || "Patient Name"}
            </h4>
            <div className="flex gap-2 text-gray-500 text-sm font-medium">
              <span>{opdState.demographics.age || "Age"} Y</span>
              <span>•</span>
              <span className="capitalize">
                {opdState.demographics.gender || "Gender"}
              </span>
              <span>•</span>
              <span className="font-mono text-[#34b6b3] bg-[#34b6b3]/10 px-2 rounded-md font-bold">
                {opdState.uhid || "UHID-XXXX"}
              </span>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {t("opd_card_specialty")}
              </p>
              <p className="text-[#1c3553] font-bold text-lg leading-tight">
                {opdState.assignedSpecialty || "General Medicine"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {t("opd_card_room")}
              </p>
              <div className="inline-block bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-lg font-bold text-lg border border-[#10b981]/20 font-mono">
                {opdState.roomNumber || "OPD-101"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {t("opd_card_date")}
              </p>
              <p className="text-[#1c3553] font-semibold">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {t("opd_card_token")}
              </p>
              <p className="text-[#1c3553] font-bold text-2xl font-mono">
                {Math.floor(Math.random() * 50) + 1}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 flex items-center gap-4 justify-between border-t border-gray-100">
          <div className="text-xs text-gray-400 font-medium max-w-[180px]">
            Please proceed to the waiting area of the assigned room. Shows this
            card when called.
          </div>
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm text-[#1c3553]">
            <QrCode size={40} />
          </div>
        </div>
      </motion.div>

      <div className="mt-10 flex gap-4 no-print">
        <Button
          size="large"
          variant="primary"
          icon={<Printer size={20} />}
          onClick={handlePrint}
          className="rounded-xl px-8 h-12 font-bold bg-[#1c3553] text-white hover:bg-[#1c3553]/90 border-none shadow-lg shadow-[#1c3553]/20"
        >
          {t("opd_card_print")}
        </Button>
        <Button
          size="large"
          variant="outline"
          icon={<Home size={20} />}
          onClick={handleHome}
          className="rounded-xl px-8 h-12 font-bold"
        >
          New Patient
        </Button>
      </div>
    </div>
  );
}
