import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVitals } from "@/redux/opdSlice";
import { Vitals as VitalsType } from "@/types/opd";

export default function Vitals() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.opd.vitals);
  const referralRequired = useAppSelector(
    (state) => state.opd.referralRequired,
  );
  
  const [formValues, setFormValues] = useState<VitalsType>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value === "" ? undefined : name === "temperature" ? parseFloat(value) : parseInt(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setVitals(formValues));
    handleNext();
  };

  const handleNext = () => {
    if (referralRequired) {
      navigate({ to: "/opd/referral" });
    } else {
      navigate({ to: "/opd/review" });
    }
  };

  const skipVitals = () => {
    handleNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col pt-6 pb-20 relative"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1c3553] mb-3">
          {t("vitals_title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("vitals_subtitle")}</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-20 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
          <Input
            name="height"
            label={t("vital_height")}
            type="number"
            value={formValues.height || ""}
            onChange={handleChange}
            placeholder="e.g. 175"
          />

          <Input
            name="weight"
            label={t("vital_weight")}
            type="number"
            value={formValues.weight || ""}
            onChange={handleChange}
            placeholder="e.g. 70"
          />

          <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
            <label className="block font-bold text-sm text-text-primary mb-2 ml-1">
              {t("vital_bp")}
            </label>
            <div className="flex gap-4">
              <Input
                name="bloodPressureSystolic"
                type="number"
                value={formValues.bloodPressureSystolic || ""}
                onChange={handleChange}
                placeholder={t("vital_bp_systolic")}
                className="text-center"
              />
              <div className="flex items-center text-xl text-gray-400 font-light">
                /
              </div>
              <Input
                name="bloodPressureDiastolic"
                type="number"
                value={formValues.bloodPressureDiastolic || ""}
                onChange={handleChange}
                placeholder={t("vital_bp_diastolic")}
                className="text-center"
              />
            </div>
          </div>

          <Input
            name="pulse"
            label={t("vital_pulse")}
            type="number"
            value={formValues.pulse || ""}
            onChange={handleChange}
            placeholder="e.g. 72"
          />

          <Input
            name="temperature"
            label={t("vital_temperature")}
            type="number"
            step="0.1"
            value={formValues.temperature || ""}
            onChange={handleChange}
            placeholder="e.g. 98.6"
          />

          <Input
            name="spo2"
            label={t("vital_spo2")}
            type="number"
            value={formValues.spo2 || ""}
            onChange={handleChange}
            placeholder="e.g. 98"
            max={100}
            className="col-span-2"
          />

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-8 z-10 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] col-span-2 w-full mt-4">
            <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
              <Button
                size="large"
                variant="outline"
                type="button"
                onClick={() => navigate({ to: "/opd/symptoms" })}
                className="rounded-xl px-8 h-12"
              >
                {t("btn_back")}
              </Button>
              <div className="flex gap-3">
                <Button
                  size="large"
                  variant="text"
                  type="button"
                  onClick={skipVitals}
                  className="rounded-xl px-6 h-12 text-gray-500 hover:text-gray-700"
                >
                  {t("vitals_skip")}
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
          </div>
        </form>
      </div>
    </motion.div>
  );
}
