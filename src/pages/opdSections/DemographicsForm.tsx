import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDemographics } from "@/redux/opdSlice";
import { PatientDemographics } from "@/types/opd";

export function DemographicsForm({ 
  next, 
  prev 
}: { 
  next: (n: number) => void; 
  prev: (n: number) => void 
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const opdState = useAppSelector((s) => s.opd);

  const [demo, setDemo] = useState<PatientDemographics>(opdState.demographics);

  const handleDemoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDemo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setDemographics({
        ...demo,
        otpVerified: opdState.demographics.otpVerified,
      }),
    );
    next(5);
  };

  return (
    <div className="mt-4">
      {opdState.imageExtracted && (
        <Alert
          type="success"
          message="AI Extraction Successful"
          description="Fields pre-filled from document. Please verify."
          className="mb-4"
        />
      )}
      <form
        onSubmit={handleDemoSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          name="name"
          label={`${t("field_name")} *`}
          value={demo.name}
          onChange={handleDemoChange}
          required
          className="md:col-span-2"
        />
        <Input
          name="fatherHusbandName"
          label={t("field_father_husband")}
          value={demo.fatherHusbandName}
          onChange={handleDemoChange}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            name="age"
            label={`${t("field_age")} *`}
            type="number"
            value={demo.age}
            onChange={handleDemoChange}
            required
            min={0}
            max={120}
          />
          <Select
            name="gender"
            label={`${t("field_gender")} *`}
            value={demo.gender}
            onChange={handleDemoChange}
            required
            options={[
              { label: t("field_gender_male"), value: "male" },
              { label: t("field_gender_female"), value: "female" },
              { label: t("field_gender_other"), value: "other" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 ml-1">
            {t("field_mobile")} *
          </label>
          <div className="flex flex-col gap-2">
            <Input
              name="mobile"
              value={demo.mobile}
              onChange={handleDemoChange}
              required
              maxLength={10}
              className="flex-1"
              fullWidth={false}
            />
          </div>
        </div>
        <Input
          name="address"
          label={t("field_address")}
          multiline
          rows={2}
          value={demo.address}
          onChange={handleDemoChange}
          className="md:col-span-2"
        />
        <div className="md:col-span-2 flex justify-between items-center mt-2">
          <Button
            variant="text"
            type="button"
            onClick={() => prev(opdState.captureMode === "image" ? 3 : 2)}
            className="rounded-xl px-0 text-gray-500 hover:text-gray-700"
          >
            ← {t("btn_back")}
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="rounded-xl px-10 font-bold shadow-md shadow-[#34b6b3]/30"
          >
            {t("btn_next")}
          </Button>
        </div>
      </form>
    </div>
  );
}
