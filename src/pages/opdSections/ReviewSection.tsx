import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { User, Activity, Heart, FileCheck, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { useToast } from "@/components/ui/Toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { finaliseVisit } from "@/redux/opdSlice";
import { useSubmitOPDSessionMutation } from "@/api/opd/mutations";

export function ReviewSection({
  setActiveSection,
  next,
  prev
}: {
  setActiveSection: (n: number) => void;
  next: (n: number) => void;
  prev: (n: number) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const opdState = useAppSelector((s) => s.opd);

  const { mutate: submitOPD, isPending: submitting } = useSubmitOPDSessionMutation();

  const handleSubmit = () => {
    submitOPD(
      { session: opdState },
      {
        onSuccess: () => {
          dispatch(finaliseVisit());
          toast("Registration submitted successfully!", "success");
          navigate({ to: "/opd/opd-card" });
        },
      },
    );
  };

  return (
    <div className="mt-4 space-y-6">
      {/* Patient header */}
      <div className="bg-[#34b6b3]/5 rounded-xl p-4 flex justify-between items-center border border-[#34b6b3]/10">
        <div>
          <p className="text-xs font-bold text-[#34b6b3] uppercase tracking-wide mb-0.5">
            {opdState.isNewPatient ? "New Patient" : "Existing Patient"}
          </p>
          <p className="font-mono font-bold text-[#1c3553] text-lg">
            {opdState.uhid}
          </p>
        </div>
        <Tag color="cyan" className="rounded-lg px-3 py-1 text-xs m-0">
          Mode: {opdState.captureMode}
        </Tag>
      </div>

      {/* Demographics */}
      <div className="border border-gray-100 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
            <User size={16} className="text-[#34b6b3]" />
            {t("review_demographics")}
          </h4>
          <button
            onClick={() => setActiveSection(4)}
            className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
          >
            <Edit size={12} />
            {t("review_edit")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {[
            ["Name", opdState.demographics.name],
            ["Age", `${opdState.demographics.age} Yrs`],
            ["Gender", opdState.demographics.gender],
            ["Mobile", opdState.demographics.mobile],
            ["Address", opdState.demographics.address],
          ].map(([label, value]) => (
            <div
              key={label}
              className={`py-1.5 border-b border-gray-50 ${label === "Address" ? "col-span-2" : ""}`}
            >
              <span className="text-gray-400 mr-2">{label}:</span>
              <span className="font-semibold text-[#1c3553]">
                {value || <span className="text-gray-300 italic">—</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="border border-gray-100 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
            <Activity size={16} className="text-[#34b6b3]" />
            {t("review_symptoms")}
          </h4>
          <button
            onClick={() => setActiveSection(5)}
            className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
          >
            <Edit size={12} />
            {t("review_edit")}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {opdState.symptoms.length > 0 ? (
            opdState.symptoms.map((s) => (
              <Tag
                key={s}
                className="text-xs bg-gray-50 border-gray-200 text-gray-700 rounded-md px-3 py-1 m-0"
              >
                {s}
              </Tag>
            ))
          ) : (
            <span className="text-gray-300 italic text-sm">
              None recorded
            </span>
          )}
        </div>
        <div className="flex items-center justify-between bg-[#10b981]/10 rounded-lg px-3 py-2">
          <p className="font-bold text-[#1c3553] text-sm">
            {opdState.assignedSpecialty}
          </p>
          <p className="font-bold text-[#10b981] font-mono text-sm">
            {opdState.roomNumber}
          </p>
        </div>
      </div>

      {/* Vitals */}
      <div className="border border-gray-100 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
            <Heart size={16} className="text-[#34b6b3]" />
            {t("review_vitals")}
          </h4>
          <button
            onClick={() => setActiveSection(6)}
            className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
          >
            <Edit size={12} />
            {t("review_edit")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            [
              "Height",
              opdState.vitals.height
                ? `${opdState.vitals.height} cm`
                : "—",
            ],
            [
              "Weight",
              opdState.vitals.weight
                ? `${opdState.vitals.weight} kg`
                : "—",
            ],
            [
              "BP",
              opdState.vitals.bloodPressureSystolic
                ? `${opdState.vitals.bloodPressureSystolic}/${opdState.vitals.bloodPressureDiastolic}`
                : "—",
            ],
            [
              "Pulse",
              opdState.vitals.pulse
                ? `${opdState.vitals.pulse} bpm`
                : "—",
            ],
            [
              "Temp",
              opdState.vitals.temperature
                ? `${opdState.vitals.temperature} °F`
                : "—",
            ],
            [
              "SpO2",
              opdState.vitals.spo2 ? `${opdState.vitals.spo2}%` : "—",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100"
            >
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p
                className={`font-bold ${value === "—" ? "text-gray-300" : "text-[#1c3553]"}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      {opdState.referralRequired && (
        <div className="border border-amber-100 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-[#1c3553] flex items-center gap-2">
              <FileCheck size={16} className="text-[#34b6b3]" />
              {t("review_referral")}
            </h4>
            <button
              onClick={() => setActiveSection(7)}
              className="text-xs text-[#34b6b3] hover:underline flex items-center gap-1"
            >
              <Edit size={12} />
              {t("review_edit")}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {opdState.referralVerified ? (
              <>
                <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="text-[#10b981] font-semibold">
                  Referral Verified
                </span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-amber-400 text-amber-400 flex items-center justify-center font-bold text-xs">
                  !
                </div>
                <span className="text-amber-500 font-medium">
                  Referral Pending
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 mt-6">
        <Button
          variant="text"
          onClick={() => prev(opdState.referralRequired ? 7 : 6)}
          className="rounded-xl px-0 text-gray-500 hover:text-gray-700 whitespace-nowrap"
        >
          ← {t("btn_back")}
        </Button>
        <Button
          variant="primary"
          isLoading={submitting}
          onClick={handleSubmit}
          disabled={
            opdState.referralRequired && !opdState.referralVerified
          }
          className="rounded-xl h-14 font-bold text-base shadow-lg shadow-[#34b6b3]/40 bg-gradient-to-r from-[#34b6b3] to-[#0da0b8] border-none"
        >
          {t("review_confirm")}
        </Button>
      </div>
    </div>
  );
}
