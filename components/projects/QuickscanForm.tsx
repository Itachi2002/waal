"use client";

import { FormEvent, useState } from "react";
import {
  QUICKSCAN_QUESTIONS,
  QUICKSCAN_STATUS_LABELS,
  QUICKSCAN_STATUSES,
} from "@/lib/domain/catalogs";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormField } from "@/components/forms/FormField";
import { SaveBar } from "@/components/forms/SaveBar";
import { useUnsavedWarning } from "@/lib/client/useUnsavedWarning";

type Answer = {
  questionCode: string;
  status: string;
  followUpAction: string;
  responsible: string;
};

export function QuickscanForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial: Answer[];
}) {
  const byCode = Object.fromEntries(initial.map((a) => [a.questionCode, a]));
  const [answers, setAnswers] = useState<Answer[]>(
    QUICKSCAN_QUESTIONS.map((q) => ({
      questionCode: q.code,
      status: byCode[q.code]?.status ?? "",
      followUpAction: byCode[q.code]?.followUpAction ?? "",
      responsible: byCode[q.code]?.responsible ?? "",
    })),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  useUnsavedWarning(dirty);

  function update(code: string, patch: Partial<Answer>) {
    setAnswers((prev) =>
      prev.map((a) => (a.questionCode === code ? { ...a, ...patch } : a)),
    );
    setDirty(true);
    setSaved(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSummary(null);
    const payload = answers.map((a) => ({
      questionCode: a.questionCode,
      status: a.status || null,
      followUpAction: a.followUpAction || null,
      responsible: a.responsible || null,
    }));
    const res = await fetch(`/api/projects/${projectId}/quickscan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.fields) setErrors(data.fields);
      setSummary(data.error || "Opslaan mislukt.");
      const first = data.fields && Object.keys(data.fields)[0];
      if (first) {
        const el = document.getElementById(first.replace(".", "-"));
        el?.focus();
      }
      setSaving(false);
      return;
    }
    setDirty(false);
    setSaved(true);
    setSaving(false);
  }

  const statusOptions = QUICKSCAN_STATUSES.map((s) => ({
    value: s,
    label: QUICKSCAN_STATUS_LABELS[s],
  }));

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-[#555]">
        Bij status Nee is één concrete vervolgactie verplicht. «Wie» is optioneel;
        vul bij voorkeur een naam in zodat de actie herleidbaar blijft.
      </p>
      {Object.keys(errors).length > 0 ? (
        <div className="rounded border border-[#e0b4b4] bg-[#fff5f5] p-3" role="alert">
          <p className="font-medium">Corrigeer de gemarkeerde velden.</p>
        </div>
      ) : null}

      <div className="space-y-4">
        {QUICKSCAN_QUESTIONS.map((q) => {
          const a = answers.find((x) => x.questionCode === q.code)!;
          const statusClass =
            a.status === "YES"
              ? "status-yes"
              : a.status === "NO"
                ? "status-no"
                : a.status === "NA"
                  ? "status-na"
                  : "";
          return (
            <article
              key={q.code}
              className="rounded-md border border-[#d8dee5] bg-white p-4 space-y-3"
            >
              <header className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">
                    {q.sortOrder}. {q.subject}
                  </h2>
                  <p className="mt-1">{q.question}</p>
                </div>
                {a.status ? (
                  <span className={`rounded px-2 py-1 text-sm font-medium ${statusClass}`}>
                    {QUICKSCAN_STATUS_LABELS[a.status as keyof typeof QUICKSCAN_STATUS_LABELS]}
                  </span>
                ) : (
                  <span className="text-sm text-[#555]">Nog niet ingevuld</span>
                )}
              </header>
              <FormSelect
                id={`${q.code}-status`}
                label="Status"
                value={a.status}
                onChange={(v) => update(q.code, { status: v })}
                options={statusOptions}
                error={errors[`${q.code}.status`]}
              />
              <FormField
                id={`${q.code}-followUpAction`}
                label="Vervolgactie"
                error={errors[`${q.code}.followUpAction`]}
              >
                <textarea
                  id={`${q.code}-followUpAction`}
                  className="w-full min-h-[88px] rounded border border-[#c5ced6] px-3 py-2"
                  value={a.followUpAction}
                  onChange={(e) =>
                    update(q.code, { followUpAction: e.target.value })
                  }
                />
              </FormField>
              <FormField
                id={`${q.code}-responsible`}
                label="Wie"
                hint={
                  !a.responsible
                    ? "Nog niemand ingevuld — vul bij voorkeur een naam in (geen taaksysteem)."
                    : undefined
                }
                error={errors[`${q.code}.responsible`]}
              >
                <input
                  id={`${q.code}-responsible`}
                  className="w-full min-h-[44px] rounded border border-[#c5ced6] px-3"
                  value={a.responsible}
                  onChange={(e) =>
                    update(q.code, { responsible: e.target.value })
                  }
                />
              </FormField>
            </article>
          );
        })}
      </div>
      <SaveBar saving={saving} saved={saved} errorSummary={summary} />
    </form>
  );
}
