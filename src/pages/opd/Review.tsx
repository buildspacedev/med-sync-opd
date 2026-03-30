import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { useToast } from "@/components/ui/Toast";
import { 
  Pencil, 
  User, 
  Heart, 
  Activity, 
  FileCheck 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { finaliseVisit } from "@/redux/opdSlice";
import { useSubmitOPDSessionMutation } from "@/api/opd";

export default function Review() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((state) => state.opd);

  // Using the new TanStack Query mutation
  const { mutate: submitOPD, isPending: submitting } =
    useSubmitOPDSessionMutation();

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

  const SectionHeader = ({
    title,
    icon,
    onEdit,
  }: {
    title: string;
    icon: React.ReactNode;
    onEdit: () => void;
  }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
      <h3 className="text-lg font-bold text-[#1c3553] flex items-center gap-2">
        <span className="text-[#34b6b3]">{icon}</span>
        {title}
      </h3>
      <Button
        variant="text"
        icon={<Pencil size={18} />}
        onClick={onEdit}
        className="text-gray-400 hover:text-[#34b6b3]"
      >
        {t("review_edit")}
      </Button>
    </div>
  );

  const DataRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="grid grid-cols-3 py-2">
      <div className="col-span-1 text-gray-500 font-medium">{label}</div>
      <div className="col-span-2 text-[#1c3553] font-semibold">
        {value || <span className="text-gray-300 italic">Not provided</span>}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col pt-6 pb-24 relative"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("review_title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("review_subtitle")}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden max-w-3xl mx-auto w-full">
        <div className="bg-[#34b6b3]/5 p-6 md:px-8 border-b border-[#34b6b3]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-sm font-bold text-[#34b6b3] uppercase tracking-wider mb-1">
              {opdState.isNewPatient
                ? "New Patient Registration"
                : "Existing Patient"}
            </div>
            <div className="text-2xl font-bold text-[#1c3553] font-mono">
              {opdState.uhid}
            </div>
          </div>
          <Tag color="cyan" className="rounded-lg px-3 py-1 m-0 text-sm">
            Mode: {opdState.captureMode}
          </Tag>
        </div>

        <div className="p-6 md:px-8 space-y-8">
          <section>
            <SectionHeader
              title={t("review_demographics")}
              icon={<User size={20} />}
              onEdit={() => navigate({ to: "/opd/demographics" })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <DataRow
                  label={t("field_name")}
                  value={opdState.demographics.name}
                />
                <DataRow
                  label={t("field_age")}
                  value={`${opdState.demographics.age} Yrs`}
                />
                <DataRow
                  label={t("field_gender")}
                  value={opdState.demographics.gender}
                />
                <DataRow
                  label={t("field_mobile")}
                  value={opdState.demographics.mobile}
                />
              </div>
              <div>
                <DataRow
                  label={t("field_address")}
                  value={opdState.demographics.address}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              title={t("review_symptoms")}
              icon={<Activity size={20} />}
              onEdit={() => navigate({ to: "/opd/symptoms" })}
            />
            <div className="mb-4">
              <p className="text-gray-500 font-medium mb-2">
                {t("step6_symptoms")}
              </p>
              <div className="flex flex-wrap gap-2">
                {opdState.symptoms.length > 0 ? (
                  opdState.symptoms.map((s) => (
                    <Tag
                      key={s}
                      className="bg-gray-50 border-gray-200 text-gray-700 rounded-md px-3 py-1 m-0"
                    >
                      {s}
                    </Tag>
                  ))
                ) : (
                  <span className="text-gray-300 italic">
                    No symptoms recorded
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#10b981]/10 rounded-xl p-4 flex items-center justify-between border border-[#10b981]/20">
              <div>
                <p className="text-[#10b981] font-semibold text-xs uppercase tracking-wider mb-1">
                  Routing To
                </p>
                <p className="text-lg font-bold text-[#1c3553]">
                  {opdState.assignedSpecialty}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-medium text-xs mb-1">Room</p>
                <p className="text-lg font-bold text-[#10b981] font-mono">
                  {opdState.roomNumber}
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              title={t("review_vitals")}
              icon={<Heart size={20} />}
              onEdit={() => navigate({ to: "/opd/vitals" })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <DataRow
                label="Height"
                value={
                  opdState.vitals.height ? `${opdState.vitals.height} cm` : ""
                }
              />
              <DataRow
                label="Weight"
                value={
                  opdState.vitals.weight ? `${opdState.vitals.weight} kg` : ""
                }
              />
              <DataRow
                label="BP"
                value={
                  opdState.vitals.bloodPressureSystolic &&
                  opdState.vitals.bloodPressureDiastolic
                    ? `${opdState.vitals.bloodPressureSystolic}/${opdState.vitals.bloodPressureDiastolic} mmHg`
                    : ""
                }
              />
              <DataRow
                label="Pulse"
                value={
                  opdState.vitals.pulse ? `${opdState.vitals.pulse} bpm` : ""
                }
              />
              <DataRow
                label="Temp"
                value={
                  opdState.vitals.temperature
                    ? `${opdState.vitals.temperature} °F`
                    : ""
                }
              />
              <DataRow
                label="SpO2"
                value={opdState.vitals.spo2 ? `${opdState.vitals.spo2} %` : ""}
              />
            </div>
          </section>

          {opdState.referralRequired && (
            <section>
              <SectionHeader
                title={t("review_referral")}
                icon={<FileCheck size={20} />}
                onEdit={() => navigate({ to: "/opd/referral" })}
              />
              <div className="flex items-center gap-3 bg-[#f59e0b]/5 rounded-xl p-4 border border-[#f59e0b]/20">
                {opdState.referralVerified ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-white">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-[#1c3553]">
                        Referral Verified
                      </p>
                      <p className="text-sm text-gray-500">
                        Document checked for super-specialty admission
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-[#f59e0b] text-[#f59e0b] flex items-center justify-center font-bold">
                      !
                    </div>
                    <div>
                      <p className="font-bold text-[#f59e0b]">
                        Referral Pending
                      </p>
                      <p className="text-sm text-[#f59e0b]/80">
                        Required for {opdState.assignedSpecialty}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-8 z-10 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto w-full flex justify-between">
          <Button
            size="large"
            variant="outline"
            onClick={() => navigate({ to: "/opd/vitals" })}
            className="rounded-xl px-8 h-12"
          >
            {t("btn_back")}
          </Button>
          <Button
            variant="primary"
            size="large"
            isLoading={submitting}
            onClick={handleSubmit}
            disabled={opdState.referralRequired && !opdState.referralVerified}
            className="rounded-xl px-12 h-12 font-bold shadow-lg shadow-[#34b6b3]/40 bg-gradient-to-r from-[#34b6b3] to-[#0da0b8] border-none text-base"
          >
            {t("review_confirm")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
