import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDemographics } from "@/redux/opdSlice";
import { PatientDemographics } from "@/types/opd";

export default function Demographics() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.opd.demographics);
  const imageExtracted = useAppSelector((state) => state.opd.imageExtracted);
  const [formValues, setFormValues] = useState<PatientDemographics>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setDemographics({ ...formValues, otpVerified: data.otpVerified }));
    navigate({ to: "/opd/symptoms" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col pt-6 pb-20 relative max-h-screen overflow-y-auto hide-scrollbar"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-2">
          {t("demographics_title")}
        </h2>
        <p className="text-gray-500">{t("demographics_subtitle")}</p>
      </div>

      {imageExtracted && (
        <Alert
          type="success"
          message="AI Extraction Successful"
          description="Fields have been pre-filled from your document. Please verify and edit if necessary."
          className="mb-6"
        />
      )}

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-20 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
          <Input
            name="name"
            label={`${t("field_name")} *`}
            value={formValues.name}
            onChange={handleChange}
            required
            className="col-span-1 md:col-span-2"
          />

          <Input
            name="fatherHusbandName"
            label={t("field_father_husband")}
            value={formValues.fatherHusbandName}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="age"
              label={`${t("field_age")} *`}
              type="number"
              value={formValues.age}
              onChange={handleChange}
              required
              min={0}
              max={120}
            />

            <Select
              name="gender"
              label={`${t("field_gender")} *`}
              value={formValues.gender}
              onChange={handleChange}
              required
              options={[
                { label: t("field_gender_male"), value: "male" },
                { label: t("field_gender_female"), value: "female" },
                { label: t("field_gender_other"), value: "other" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-text-primary ml-1">
              {t("field_mobile")} *
            </label>
            <div className="flex gap-2">
              <Input
                name="mobile"
                value={formValues.mobile}
                onChange={handleChange}
                required
                maxLength={10}
                className="flex-1"
                fullWidth={false}
              />
              <Button
                variant="outline"
                type="button"
                className="h-12 rounded-xl"
              >
                {t("field_otp_verify")}
              </Button>
            </div>
          </div>

          <Input
            name="address"
            label={t("field_address")}
            multiline
            rows={3}
            value={formValues.address}
            onChange={handleChange}
            className="col-span-1 md:col-span-2"
          />

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-8 z-10 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] col-span-1 md:col-span-2 w-full mt-4">
            <div className="max-w-4xl mx-auto w-full flex justify-between">
              <Button
                size="large"
                variant="outline"
                type="button"
                onClick={() => navigate({ to: "/opd/capture-mode" })}
                className="rounded-xl px-8 h-12"
              >
                {t("btn_back")}
              </Button>
              <Button
                variant="primary"
                size="large"
                type="submit"
                className="rounded-xl px-10 h-12 font-bold shadow-md shadow-[#34b6b3]/30"
              >
                {t("btn_next")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
