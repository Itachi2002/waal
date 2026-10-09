"use client";

import { FormEvent, useState } from "react";
import {
  VALIDATION_SCORES,
  YES_PARTIAL_NO,
  YES_PARTIAL_NO_LABELS,
} from "@/lib/domain/catalogs";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormField } from "@/components/forms/FormField";
import { SaveBar } from "@/components/forms/SaveBar";
import { useUnsavedWarning } from "@/lib/client/useUnsavedWarning";
import {
  ConflictError,
  FieldValidationError,
  store,
} from "@/lib/client/store";

type Values = {
  revision: number;
  testedBy: string;
  role: string;
  date: string;
  projectSituation: string;
  clarityScore: string;
  practicalityScore: string;
  completenessScore: string;
  timeBurdenScore: string;
  wouldUse: string;
  fitsWaal: string;
  keyFeedback: string;
  processedChange: string;
  remark: string;
};

export function ValidationForm({ initial }: { initial: Values }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  useUnsavedWarning(dirty);

  function set(key: keyof Values, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setDirty(true);
    setSaved(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSummary(null);
    try {
      const validation = store.saveValidation({
        ...values,
        clarityScore: values.clarityScore || null,
        practicalityScore: values.practicalityScore || null,
        completenessScore: values.completenessScore || null,
        timeBurdenScore: values.timeBurdenScore || null,
        wouldUse: values.wouldUse || null,
        fitsWaal: values.fitsWaal || null,
      });
      setValues((v) => ({ ...v, revision: validation.revision }));
      setDirty(false);
      setSaved(true);
    } catch (err) {
      if (err instanceof FieldValidationError) {
        setErrors(err.fields);
        setSummary(err.message);
      } else if (err instanceof ConflictError) {
        setSummary(err.message);
      } else {
        setSummary("Opslaan mislukt. Invoer is behouden.");
      }
    }
    setSaving(false);
  }

  const scoreOptions = VALIDATION_SCORES.map((s) => ({
    value: String(s),
    label: String(s),
  }));
  const ypn = YES_PARTIAL_NO.map((s) => ({
    value: s,
    label: YES_PARTIAL_NO_LABELS[s],
  }));
  const inputClass =
    "w-full min-h-[44px] rounded border border-[#c5ced6] bg-white px-3";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm font-medium">1 = onvoldoende, 5 = zeer goed</p>
      <p className="text-sm text-[#555]">
        Scores zijn onafhankelijke oordelen. Er wordt geen totaal, gemiddelde of
        eindcijfer berekend.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <FormField id="testedBy" label="Getest door" error={errors.testedBy}>
          <input
            id="testedBy"
            className={inputClass}
            value={values.testedBy}
            onChange={(e) => set("testedBy", e.target.value)}
          />
        </FormField>
        <FormField id="role" label="Functie" error={errors.role}>
          <input
            id="role"
            className={inputClass}
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </FormField>
        <FormField id="date" label="Datum" error={errors.date}>
          <input
            id="date"
            type="date"
            className={inputClass}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </FormField>
      </div>
      <FormField
        id="projectSituation"
        label="Project / situatie"
        error={errors.projectSituation}
      >
        <textarea
          id="projectSituation"
          className="w-full min-h-[72px] rounded border border-[#c5ced6] px-3 py-2"
          value={values.projectSituation}
          onChange={(e) => set("projectSituation", e.target.value)}
        />
      </FormField>

      <div className="grid gap-3 md:grid-cols-2">
        <FormSelect
          id="clarityScore"
          label="Duidelijkheid (1–5)"
          value={values.clarityScore}
          onChange={(v) => set("clarityScore", v)}
          options={scoreOptions}
          error={errors.clarityScore}
        />
        <FormSelect
          id="practicalityScore"
          label="Praktische bruikbaarheid (1–5)"
          value={values.practicalityScore}
          onChange={(v) => set("practicalityScore", v)}
          options={scoreOptions}
          error={errors.practicalityScore}
        />
        <FormSelect
          id="wouldUse"
          label="Zou je dit gebruiken?"
          value={values.wouldUse}
          onChange={(v) => set("wouldUse", v)}
          options={ypn}
          error={errors.wouldUse}
        />
        <FormSelect
          id="completenessScore"
          label="Volledigheid (1–5)"
          value={values.completenessScore}
          onChange={(v) => set("completenessScore", v)}
          options={scoreOptions}
          error={errors.completenessScore}
        />
        <FormSelect
          id="timeBurdenScore"
          label="Tijdsbelasting passend? (1–5)"
          value={values.timeBurdenScore}
          onChange={(v) => set("timeBurdenScore", v)}
          options={scoreOptions}
          error={errors.timeBurdenScore}
        />
        <FormSelect
          id="fitsWaal"
          label="Past bij werkwijze Waal?"
          value={values.fitsWaal}
          onChange={(v) => set("fitsWaal", v)}
          options={ypn}
          error={errors.fitsWaal}
        />
      </div>

      <FormField
        id="keyFeedback"
        label="Belangrijkste feedback"
        error={errors.keyFeedback}
      >
        <textarea
          id="keyFeedback"
          className="w-full min-h-[88px] rounded border border-[#c5ced6] px-3 py-2"
          value={values.keyFeedback}
          onChange={(e) => set("keyFeedback", e.target.value)}
        />
      </FormField>
      <FormField
        id="processedChange"
        label="Verwerkte aanpassing"
        error={errors.processedChange}
      >
        <textarea
          id="processedChange"
          className="w-full min-h-[88px] rounded border border-[#c5ced6] px-3 py-2"
          value={values.processedChange}
          onChange={(e) => set("processedChange", e.target.value)}
        />
      </FormField>
      <FormField id="remark" label="Opmerking" error={errors.remark}>
        <textarea
          id="remark"
          className="w-full min-h-[72px] rounded border border-[#c5ced6] px-3 py-2"
          value={values.remark}
          onChange={(e) => set("remark", e.target.value)}
        />
      </FormField>

      <SaveBar saving={saving} saved={saved} errorSummary={summary} />
    </form>
  );
}
