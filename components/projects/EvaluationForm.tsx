"use client";

import { FormEvent, useState } from "react";
import {
  EVALUATION_GROUPS,
  EVALUATION_QUESTIONS,
  EVALUATION_ROUTE_LABELS,
  EVALUATION_ROUTES,
  UNIT_LABELS,
  UNITS,
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

type StreamRow = {
  groupCode: string;
  actualQuantity: string;
  unit: string;
  containerChanges: string;
  route: string;
  explanation: string;
};

export function EvaluationForm({
  projectId,
  initialStreams,
  initialQuestions,
  revision,
}: {
  projectId: string;
  initialStreams: StreamRow[];
  initialQuestions: {
    attentionStream: string;
    workedWell: string;
    didNotWork: string;
    nextProjectChange: string;
  };
  revision: number;
}) {
  const byCode = Object.fromEntries(initialStreams.map((s) => [s.groupCode, s]));
  const [rows, setRows] = useState<StreamRow[]>(
    EVALUATION_GROUPS.map((g) => ({
      groupCode: g.code,
      actualQuantity: byCode[g.code]?.actualQuantity ?? "",
      unit: byCode[g.code]?.unit ?? "",
      containerChanges: byCode[g.code]?.containerChanges ?? "",
      route: byCode[g.code]?.route ?? "",
      explanation: byCode[g.code]?.explanation ?? "",
    })),
  );
  const [questions, setQuestions] = useState(initialQuestions);
  const [rev, setRev] = useState(revision);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  useUnsavedWarning(dirty);

  function updateRow(code: string, patch: Partial<StreamRow>) {
    setRows((prev) =>
      prev.map((r) => (r.groupCode === code ? { ...r, ...patch } : r)),
    );
    setDirty(true);
    setSaved(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSummary(null);
    try {
      const evaluation = store.saveEvaluation(projectId, {
        revision: rev,
        streams: rows.map((r) => ({
          groupCode: r.groupCode,
          actualQuantity: r.actualQuantity || null,
          unit: r.unit || null,
          containerChanges: r.containerChanges || null,
          route: r.route || null,
          explanation: r.explanation || null,
        })),
        ...questions,
      });
      setRev(evaluation.revision);
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

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="rounded-md border border-[#d8dee5] bg-white p-4 text-sm space-y-2">
        <p>
          Neem werkelijke gegevens na afloop handmatig over uit project- en
          REMONDIS-gegevens. Er is geen automatische som vanuit Materiaalstromen
          (andere groepen/eenheden).
        </p>
        <p>
          Relevante gecontroleerde informatie handmatig doorgeven aan de
          KAM-coördinator. Deze app vervangt het centrale afvaloverzicht niet en
          stuurt geen e-mail of notificatie.
        </p>
      </div>

      {rows.map((r) => {
        const g = EVALUATION_GROUPS.find((x) => x.code === r.groupCode)!;
        return (
          <article
            key={r.groupCode}
            className="rounded-md border border-[#d8dee5] bg-white p-4 space-y-3"
          >
            <h2 className="font-semibold">
              {g.sortOrder}. {g.label}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                id={`${r.groupCode}-actualQuantity`}
                label="Werkelijke hoeveelheid"
                error={errors[`${r.groupCode}.actualQuantity`]}
              >
                <input
                  id={`${r.groupCode}-actualQuantity`}
                  className="w-full min-h-[44px] rounded border border-[#c5ced6] px-3"
                  value={r.actualQuantity}
                  onChange={(e) =>
                    updateRow(r.groupCode, { actualQuantity: e.target.value })
                  }
                />
              </FormField>
              <FormSelect
                id={`${r.groupCode}-unit`}
                label="Eenheid"
                value={r.unit}
                onChange={(v) => updateRow(r.groupCode, { unit: v })}
                options={UNITS.map((u) => ({
                  value: u,
                  label: UNIT_LABELS[u],
                }))}
                error={errors[`${r.groupCode}.unit`]}
              />
              <FormField
                id={`${r.groupCode}-containerChanges`}
                label="Containerwissels"
                error={errors[`${r.groupCode}.containerChanges`]}
              >
                <input
                  id={`${r.groupCode}-containerChanges`}
                  className="w-full min-h-[44px] rounded border border-[#c5ced6] px-3"
                  value={r.containerChanges}
                  onChange={(e) =>
                    updateRow(r.groupCode, {
                      containerChanges: e.target.value,
                    })
                  }
                />
              </FormField>
              <FormSelect
                id={`${r.groupCode}-route`}
                label="Route / verwerking"
                value={r.route}
                onChange={(v) => updateRow(r.groupCode, { route: v })}
                options={EVALUATION_ROUTES.map((u) => ({
                  value: u,
                  label: EVALUATION_ROUTE_LABELS[u],
                }))}
                error={errors[`${r.groupCode}.route`]}
              />
            </div>
            <FormField
              id={`${r.groupCode}-explanation`}
              label="Bijzonderheid/verklaring"
              error={errors[`${r.groupCode}.explanation`]}
            >
              <textarea
                id={`${r.groupCode}-explanation`}
                className="w-full min-h-[72px] rounded border border-[#c5ced6] px-3 py-2"
                value={r.explanation}
                onChange={(e) =>
                  updateRow(r.groupCode, { explanation: e.target.value })
                }
              />
            </FormField>
          </article>
        );
      })}

      <section className="rounded-md border border-[#d8dee5] bg-white p-4 space-y-3">
        <h2 className="font-semibold">Leerpunten</h2>
        {EVALUATION_QUESTIONS.map((q) => (
          <FormField
            key={q.key}
            id={q.key}
            label={q.label}
            error={errors[q.key]}
          >
            <textarea
              id={q.key}
              className="w-full min-h-[88px] rounded border border-[#c5ced6] px-3 py-2"
              value={questions[q.key]}
              onChange={(e) => {
                setQuestions((prev) => ({ ...prev, [q.key]: e.target.value }));
                setDirty(true);
                setSaved(false);
              }}
            />
          </FormField>
        ))}
      </section>

      <SaveBar saving={saving} saved={saved} errorSummary={summary} />
    </form>
  );
}
