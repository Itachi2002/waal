"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/FormField";
import { SaveBar } from "@/components/forms/SaveBar";
import { useUnsavedWarning } from "@/lib/client/useUnsavedWarning";
import {
  ConflictError,
  FieldValidationError,
  store,
} from "@/lib/client/store";

export type ProjectFormValues = {
  name: string;
  projectNumber: string;
  scanDate: string;
  executor: string;
  planner: string;
  projectPhase: string;
  scanResponsible: string;
  constructionMethodType: string;
  scanVersion: string;
  revision?: number;
};

export function ProjectForm({
  initial,
  mode,
  projectId,
}: {
  initial: ProjectFormValues;
  mode: "create" | "edit";
  projectId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  useUnsavedWarning(dirty);

  function set<K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setDirty(true);
    setSaved(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSummary(null);
    setErrors({});
    try {
      if (mode === "create") {
        const project = store.createProject(values);
        setDirty(false);
        setSaved(true);
        router.push(`/projects/start/?id=${encodeURIComponent(project.id)}`);
      } else {
        const project = store.updateProject(projectId!, {
          ...values,
          revision: values.revision ?? 1,
        });
        setValues((v) => ({ ...v, revision: project.revision }));
        setDirty(false);
        setSaved(true);
      }
    } catch (err) {
      if (err instanceof FieldValidationError) {
        setErrors(err.fields);
        setSummary(err.message);
        const first = Object.keys(err.fields)[0];
        if (first) document.getElementById(first)?.focus();
      } else if (err instanceof ConflictError) {
        setSummary(err.message);
      } else {
        setSummary("Opslaan mislukt. Invoer is behouden.");
      }
    }
    setSaving(false);
  }

  const inputClass = "input-app";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {summary && Object.keys(errors).length > 0 ? (
        <div className="rounded border border-[#e0b4b4] bg-[#fff5f5] p-3" role="alert">
          <p className="font-medium">Corrigeer de volgende fouten:</p>
          <ul className="list-disc pl-5 text-sm">
            {Object.entries(errors).map(([k, v]) => (
              <li key={k}>
                <a href={`#${k}`} className="underline">
                  {v}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <FormField id="name" label="Project" error={errors.name}>
        <input
          id="name"
          className={inputClass}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
      </FormField>
      <FormField
        id="projectNumber"
        label="Projectnummer"
        error={errors.projectNumber}
        hint="Voorloopnullen blijven behouden."
      >
        <input
          id="projectNumber"
          className={inputClass}
          value={values.projectNumber}
          onChange={(e) => set("projectNumber", e.target.value)}
        />
      </FormField>
      <FormField id="scanDate" label="Datum" error={errors.scanDate}>
        <input
          id="scanDate"
          type="date"
          className={inputClass}
          value={values.scanDate}
          onChange={(e) => set("scanDate", e.target.value)}
        />
      </FormField>
      <FormField id="executor" label="Uitvoerder" error={errors.executor}>
        <input
          id="executor"
          className={inputClass}
          value={values.executor}
          onChange={(e) => set("executor", e.target.value)}
        />
      </FormField>
      <FormField id="planner" label="Werkvoorbereider" error={errors.planner}>
        <input
          id="planner"
          className={inputClass}
          value={values.planner}
          onChange={(e) => set("planner", e.target.value)}
        />
      </FormField>
      <FormField
        id="projectPhase"
        label="Projectfase"
        error={errors.projectPhase}
        hint="Vrije tekst — geen afgeleide dropdown."
      >
        <input
          id="projectPhase"
          className={inputClass}
          value={values.projectPhase}
          onChange={(e) => set("projectPhase", e.target.value)}
        />
      </FormField>
      <FormField
        id="scanResponsible"
        label="Verantwoordelijke scan"
        error={errors.scanResponsible}
      >
        <input
          id="scanResponsible"
          className={inputClass}
          value={values.scanResponsible}
          onChange={(e) => set("scanResponsible", e.target.value)}
        />
      </FormField>
      <FormField
        id="constructionMethodType"
        label="Bouwmethode/projecttype"
        error={errors.constructionMethodType}
      >
        <input
          id="constructionMethodType"
          className={inputClass}
          value={values.constructionMethodType}
          onChange={(e) => set("constructionMethodType", e.target.value)}
        />
      </FormField>
      <FormField
        id="scanVersion"
        label="Versie"
        error={errors.scanVersion}
        hint="Scanversie (niet de softwareversie)."
      >
        <input
          id="scanVersion"
          className={inputClass}
          value={values.scanVersion}
          onChange={(e) => set("scanVersion", e.target.value)}
        />
      </FormField>

      <SaveBar saving={saving} saved={saved} errorSummary={summary} />
    </form>
  );
}
