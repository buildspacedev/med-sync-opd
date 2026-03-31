import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVitals } from "@/redux/opdSlice";
import { Vitals as VitalsType } from "@/types/opd";

export function VitalsForm({ 
  next, 
  prev 
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void 
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((s) => s.opd);

  const [vitals, setVitalsState] = useState<VitalsType>(opdState.vitals);

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitalsState((prevVal) => ({
      ...prevVal,
      [name]:
        value === ""
          ? undefined
          : name === "temperature"
            ? parseFloat(value)
            : parseInt(value),
    }));
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setVitals(vitals));
    if (opdState.referralRequired) next(7);
    else next(8);
  };

  const skipVitals = () => {
    if (opdState.referralRequired) next(7);
    else next(8);
  };

  return (
    <form onSubmit={handleVitalsSubmit} className="mt-4 grid grid-cols-2 gap-4">
      <Input
        name="height"
        label={t("vital_height")}
        type="number"
        value={vitals.height || ""}
        onChange={handleVitalsChange}
        placeholder="e.g. 175"
      />
      <Input
        name="weight"
        label={t("vital_weight")}
        type="number"
        value={vitals.weight || ""}
        onChange={handleVitalsChange}
        placeholder="e.g. 70"
      />
      <div className="col-span-2 border-t border-gray-100 pt-3">
        <label className="block font-bold text-sm text-gray-700 mb-2 ml-1">
          {t("vital_bp")}
        </label>
        <div className="flex gap-3 items-center">
          <Input
            name="bloodPressureSystolic"
            type="number"
            value={vitals.bloodPressureSystolic || ""}
            onChange={handleVitalsChange}
            placeholder={t("vital_bp_systolic")}
            className="text-center"
          />
          <span className="text-gray-400 text-xl">/</span>
          <Input
            name="bloodPressureDiastolic"
            type="number"
            value={vitals.bloodPressureDiastolic || ""}
            onChange={handleVitalsChange}
            placeholder={t("vital_bp_diastolic")}
            className="text-center"
          />
        </div>
      </div>
      <Input
        name="pulse"
        label={t("vital_pulse")}
        type="number"
        value={vitals.pulse || ""}
        onChange={handleVitalsChange}
        placeholder="e.g. 72"
      />
      <Input
        name="temperature"
        label={t("vital_temperature")}
        type="number"
        step="0.1"
        value={vitals.temperature || ""}
        onChange={handleVitalsChange}
        placeholder="e.g. 98.6"
      />
      <Input
        name="spo2"
        label={t("vital_spo2")}
        type="number"
        value={vitals.spo2 || ""}
        onChange={handleVitalsChange}
        placeholder="e.g. 98"
        max={100}
        className="col-span-2"
      />
      <div className="col-span-2 flex justify-between items-center mt-2">
        <Button
          variant="text"
          type="button"
          onClick={() => prev(5)}
          className="text-gray-500 hover:text-gray-700 rounded-xl px-0 text-base"
        >
          ← {t("btn_back")}
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="text"
            type="button"
            onClick={skipVitals}
            className="text-gray-500 hover:text-gray-700 rounded-xl"
          >
            {t("vitals_skip")}
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
          >
            {t("btn_next")}
          </Button>
        </div>
      </div>
    </form>
  );
}
