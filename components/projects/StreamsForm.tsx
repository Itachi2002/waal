"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  CAUSE_CODES,
  CAUSE_LABELS,
  CHEMICAL_STREAM_CODE,
  CONSTRUCTION_PHASE_LABELS,
  CONSTRUCTION_PHASES,
  MATERIAL_STREAMS,
  OCCURS_LABELS,
  OCCURS_OPTIONS,
  STREAM_ROUTE_LABELS,
  STREAM_ROUTES,
  UNIT_LABELS,
  UNITS,
  type StreamCode,
} from "@/lib/domain/catalogs";
import { allowedStreamRoutes } from "@/lib/domain/route-rules";
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
  streamCode: string;
  occurs: string;
  constructionPhase: string;
  quantity: string;
  unit: string;
  causeCode: string;
  nextRoute: string;
  revision: number;
  id: string;
};

export function StreamsForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial: StreamRow[];
}) {
  const byCode = Object.fromEntries(initial.map((s) => [s.streamCode, s]));
  const [rows, setRows] = useState<StreamRow[]>(
    MATERIAL_STREAMS.map((m) => ({
      streamCode: m.code,
      occurs: byCode[m.code]?.occurs ?? "",
      constructionPhase: byCode[m.code]?.constructionPhase ?? "",
      quantity: byCode[m.code]?.quantity ?? "",
      unit: byCode[m.code]?.unit ?? "",
      causeCode: byCode[m.code]?.causeCode ?? "",
      nextRoute: byCode[m.code]?.nextRoute ?? "",
      revision: byCode[m.code]?.revision ?? 1,
      id: byCode[m.code]?.id ?? "",
    })),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  useUnsavedWarning(dirty);

  function update(code: string, patch: Partial<StreamRow>) {
    setRows((prev) =>
      prev.map((r) => (r.streamCode === code ? { ...r, ...patch } : r)),
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
      const streams = store.saveStreams(
        projectId,
        rows.map((r) => ({
          streamCode: r.streamCode,
          occurs: r.occurs || null,
          constructionPhase: r.constructionPhase || null,
          quantity: r.quantity || null,
          unit: r.unit || null,
          causeCode: r.causeCode || null,
          nextRoute: r.nextRoute || null,
        })),
        Object.fromEntries(rows.map((r) => [r.streamCode, r.revision])),
      );
      setRows((prev) =>
        prev.map((r) => {
          const updated = streams.find((s) => s.streamCode === r.streamCode);
          return updated
            ? {
                ...r,
                revision: updated.revision,
                quantity: updated.quantity ?? "",
                id: updated.id,
              }
            : r;
        }),
      );
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
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm text-[#555]">
        Registreer alleen werkelijk voorkomende stromen. Bij Nee blijven eerder
        ingevulde details bewaard (inactief). Voorbeelden zijn hulptekst, geen
        apart register.
      </p>
      <details className="rounded border border-[#d8dee5] bg-white p-3 text-sm">
        <summary className="cursor-pointer font-medium">Oorzaaklegenda O1–O8</summary>
        <ul className="mt-2 list-disc pl-5">
          {CAUSE_CODES.filter((c) => c.startsWith("O")).map((c) => (
            <li key={c}>{CAUSE_LABELS[c]}</li>
          ))}
        </ul>
      </details>

      {rows.map((r) => {
        const def = MATERIAL_STREAMS.find((m) => m.code === r.streamCode)!;
        const inactive = r.occurs === "NO";
        const unanswered = !r.occurs;
        const routeOptions = allowedStreamRoutes(r.streamCode as StreamCode)
          .filter((code) => (STREAM_ROUTES as readonly string[]).includes(code))
          .map((code) => ({
            value: code,
            label: STREAM_ROUTE_LABELS[code],
          }));

        return (
          <article
            key={r.streamCode}
            className={`rounded-md border bg-white p-4 space-y-3 ${
              inactive ? "border-[#c5ced6] opacity-80" : "border-[#d8dee5]"
            }`}
          >
            <header>
              <h2 className="font-semibold">
                {def.sortOrder}. {def.label}
              </h2>
              <p className="text-sm text-[#555]">{def.examples}</p>
              {inactive ? (
                <p className="mt-1 text-sm status-na inline-block rounded px-2 py-0.5">
                  Inactief (Nee) — details bewaard, niet in actieve overzichten
                </p>
              ) : null}
              {unanswered ? (
                <p className="mt-1 text-sm text-[#555]">Nog niet beantwoord</p>
              ) : null}
              {r.streamCode === CHEMICAL_STREAM_CODE ? (
                <p className="mt-1 text-sm status-attention rounded px-2 py-1 inline-block">
                  Chemisch afval: alleen Specifieke afvalroute als vastgelegde
                  vervolgroute.
                </p>
              ) : null}
            </header>

            <div className="grid gap-3 md:grid-cols-2">
              <FormSelect
                id={`${r.streamCode}-occurs`}
                label="Komt voor?"
                value={r.occurs}
                onChange={(v) => update(r.streamCode, { occurs: v })}
                options={OCCURS_OPTIONS.map((o) => ({
                  value: o,
                  label: OCCURS_LABELS[o],
                }))}
                error={errors[`${r.streamCode}.occurs`]}
              />
              <FormSelect
                id={`${r.streamCode}-constructionPhase`}
                label="Bouwfase"
                value={r.constructionPhase}
                onChange={(v) => update(r.streamCode, { constructionPhase: v })}
                options={CONSTRUCTION_PHASES.map((o) => ({
                  value: o,
                  label: CONSTRUCTION_PHASE_LABELS[o],
                }))}
                error={errors[`${r.streamCode}.constructionPhase`]}
              />
              <FormField
                id={`${r.streamCode}-quantity`}
                label="Hoeveelheid"
                error={errors[`${r.streamCode}.quantity`]}
                hint="Decimaal met komma of punt. Leeg = onbekend; 0 = werkelijk nul."
              >
                <input
                  id={`${r.streamCode}-quantity`}
                  className="w-full min-h-[44px] rounded border border-[#c5ced6] px-3"
                  value={r.quantity}
                  onChange={(e) =>
                    update(r.streamCode, { quantity: e.target.value })
                  }
                  disabled={inactive}
                />
              </FormField>
              <FormSelect
                id={`${r.streamCode}-unit`}
                label="Eenheid"
                value={r.unit}
                onChange={(v) => update(r.streamCode, { unit: v })}
                options={UNITS.map((o) => ({
                  value: o,
                  label: UNIT_LABELS[o],
                }))}
                error={errors[`${r.streamCode}.unit`]}
              />
              <FormSelect
                id={`${r.streamCode}-causeCode`}
                label="Oorzaakcode"
                value={r.causeCode}
                onChange={(v) => update(r.streamCode, { causeCode: v })}
                options={CAUSE_CODES.map((o) => ({
                  value: o,
                  label: CAUSE_LABELS[o],
                }))}
                error={errors[`${r.streamCode}.causeCode`]}
              />
              <FormSelect
                id={`${r.streamCode}-nextRoute`}
                label="Vervolgroute"
                value={r.nextRoute}
                onChange={(v) => update(r.streamCode, { nextRoute: v })}
                options={routeOptions}
                error={errors[`${r.streamCode}.nextRoute`]}
              />
            </div>

            {r.nextRoute === "NEEDS_ASSESSMENT" && r.occurs === "YES" ? (
              <p className="status-attention rounded px-3 py-2 text-sm font-medium">
                Nog beoordelen —{" "}
                <Link
                  className="underline"
                  href={`/projects/assessments/?id=${encodeURIComponent(projectId)}&stream=${encodeURIComponent(r.id)}`}
                >
                  Open beoordeling voor deze stroom
                </Link>
              </p>
            ) : null}
          </article>
        );
      })}
      <SaveBar saving={saving} saved={saved} errorSummary={summary} />
    </form>
  );
}
