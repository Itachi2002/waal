"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ASSESSMENT_ROUTE_LABELS,
  ASSESSMENT_ROUTES,
  CONDITION_LABELS,
  CONDITIONS,
  MATERIAL_STREAMS,
  RECYCLABLE,
  RECYCLABLE_LABELS,
  RETURN_CONFIRMED,
  RETURN_CONFIRMED_LABELS,
  TRI_STATE,
  TRI_STATE_LABELS,
} from "@/lib/domain/catalogs";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormField } from "@/components/forms/FormField";
import { SaveBar } from "@/components/forms/SaveBar";
import { useUnsavedWarning } from "@/lib/client/useUnsavedWarning";

type StreamOpt = { id: string; streamCode: string; revision: number };
type Assessment = {
  id: string;
  projectMaterialStreamId: string | null;
  materialType: string | null;
  condition: string | null;
  reusable: string | null;
  returnConfirmed: string | null;
  recyclable: string | null;
  finalRoute: string | null;
  storageLocation: string | null;
  followUpAction: string | null;
  responsible: string | null;
  revision: number;
  projectMaterialStream?: { streamCode: string; revision: number } | null;
};

const emptyForm = {
  projectMaterialStreamId: "",
  materialType: "",
  condition: "",
  reusable: "",
  returnConfirmed: "",
  recyclable: "",
  finalRoute: "",
  storageLocation: "",
  followUpAction: "",
  responsible: "",
  revision: 1,
  applyRouteToStream: false,
};

export function AssessmentsPanel({
  projectId,
  assessments,
  streams,
}: {
  projectId: string;
  assessments: Assessment[];
  streams: StreamOpt[];
}) {
  const search = useSearchParams();
  const router = useRouter();
  const prelink = search.get("stream") || "";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    ...emptyForm,
    projectMaterialStreamId: prelink,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(!!prelink);
  useUnsavedWarning(dirty);

  const streamRevision = useMemo(() => {
    const s = streams.find((x) => x.id === form.projectMaterialStreamId);
    return s?.revision ?? 1;
  }, [streams, form.projectMaterialStreamId]);

  function startNew() {
    setEditingId(null);
    setForm({ ...emptyForm, projectMaterialStreamId: prelink });
    setShowForm(true);
    setSaved(false);
    setErrors({});
  }

  function startEdit(a: Assessment) {
    setEditingId(a.id);
    setForm({
      projectMaterialStreamId: a.projectMaterialStreamId ?? "",
      materialType: a.materialType ?? "",
      condition: a.condition ?? "",
      reusable: a.reusable ?? "",
      returnConfirmed: a.returnConfirmed ?? "",
      recyclable: a.recyclable ?? "",
      finalRoute: a.finalRoute ?? "",
      storageLocation: a.storageLocation ?? "",
      followUpAction: a.followUpAction ?? "",
      responsible: a.responsible ?? "",
      revision: a.revision,
      applyRouteToStream: false,
    });
    setShowForm(true);
    setSaved(false);
    setErrors({});
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSummary(null);
    const payload = {
      projectMaterialStreamId: form.projectMaterialStreamId || null,
      materialType: form.materialType || null,
      condition: form.condition || null,
      reusable: form.reusable || null,
      returnConfirmed: form.returnConfirmed || null,
      recyclable: form.recyclable || null,
      finalRoute: form.finalRoute || null,
      storageLocation: form.storageLocation || null,
      followUpAction: form.followUpAction || null,
      responsible: form.responsible || null,
      revision: form.revision,
      applyRouteToStream: form.applyRouteToStream,
      streamRevision,
    };
    const url = editingId
      ? `/api/projects/${projectId}/assessments/${editingId}`
      : `/api/projects/${projectId}/assessments`;
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.fields) setErrors(data.fields);
      setSummary(data.error || "Opslaan mislukt.");
      setSaving(false);
      return;
    }
    setDirty(false);
    setSaved(true);
    setSaving(false);
    router.refresh();
    if (!editingId && data.assessment) {
      setEditingId(data.assessment.id);
      setForm((f) => ({ ...f, revision: data.assessment.revision }));
    } else if (data.assessment) {
      setForm((f) => ({ ...f, revision: data.assessment.revision }));
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Deze beoordeling verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
      return;
    }
    const res = await fetch(`/api/projects/${projectId}/assessments/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
      }
      router.refresh();
    }
  }

  const inputClass =
    "w-full min-h-[44px] rounded border border-[#c5ced6] bg-white px-3";

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#555]">
        Alleen gebruiken wanneer een specifiek materiaal extra beoordeling nodig
        heeft. Retour route alleen bij bevestiging Ja voor dit project (geen
        algemene leveranciergarantie). Geen automatische routekeuze uit de drie
        beslisvragen.
      </p>

      <section className="rounded-md border border-[#d8dee5] bg-white p-4">
        <h2 className="font-semibold mb-2">Beslisvragen (ter ondersteuning)</h2>
        <ol className="list-decimal pl-5 text-sm space-y-1">
          <li>Is het materiaal technisch en praktisch bruikbaar?</li>
          <li>
            Is retour voor dit project bevestigd door leverancier/producent?
          </li>
          <li>Is het schoon en gescheiden te verwerken?</li>
        </ol>
      </section>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Beoordelingen</h2>
        <button type="button" className="btn btn-primary" onClick={startNew}>
          Nieuwe beoordeling
        </button>
      </div>

      <ul className="space-y-2">
        {assessments.length === 0 ? (
          <li className="text-sm text-[#555]">Nog geen beoordelingen.</li>
        ) : (
          assessments.map((a) => {
            const streamLabel = a.projectMaterialStream
              ? MATERIAL_STREAMS.find(
                  (m) => m.code === a.projectMaterialStream!.streamCode,
                )?.label
              : null;
            return (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-[#d8dee5] bg-white p-3"
              >
                <div>
                  <p className="font-medium">
                    {a.materialType || "Zonder materiaalomschrijving"}
                  </p>
                  <p className="text-sm text-[#555]">
                    {streamLabel ? `Stroom: ${streamLabel}` : "Geen stroomkoppeling"}
                    {" · "}
                    Route:{" "}
                    {a.finalRoute
                      ? ASSESSMENT_ROUTE_LABELS[
                          a.finalRoute as keyof typeof ASSESSMENT_ROUTE_LABELS
                        ]
                      : "Nog te bepalen"}
                    {a.returnConfirmed === "CHECK" ? (
                      <span className="status-attention ml-2 rounded px-1">
                        Nog controleren
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => startEdit(a)}
                  >
                    Bewerken
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onDelete(a.id)}
                  >
                    Verwijderen
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {showForm ? (
        <form
          onSubmit={onSubmit}
          className="rounded-md border border-[#d8dee5] bg-white p-4 space-y-3"
          noValidate
        >
          <h3 className="font-semibold">
            {editingId ? "Beoordeling bewerken" : "Nieuwe beoordeling"}
          </h3>
          <FormSelect
            id="projectMaterialStreamId"
            label="Gekoppelde materiaalstroom (optioneel)"
            value={form.projectMaterialStreamId}
            onChange={(v) => {
              setForm((f) => ({ ...f, projectMaterialStreamId: v }));
              setDirty(true);
            }}
            options={streams.map((s) => ({
              value: s.id,
              label:
                MATERIAL_STREAMS.find((m) => m.code === s.streamCode)?.label ??
                s.streamCode,
            }))}
          />
          <FormField id="materialType" label="Materiaal / soort" error={errors.materialType}>
            <input
              id="materialType"
              className={inputClass}
              value={form.materialType}
              onChange={(e) => {
                setForm((f) => ({ ...f, materialType: e.target.value }));
                setDirty(true);
              }}
            />
          </FormField>
          <FormSelect
            id="condition"
            label="Conditie"
            value={form.condition}
            onChange={(v) => {
              setForm((f) => ({ ...f, condition: v }));
              setDirty(true);
            }}
            options={CONDITIONS.map((c) => ({
              value: c,
              label: CONDITION_LABELS[c],
            }))}
            error={errors.condition}
          />
          <FormSelect
            id="reusable"
            label="Hergebruik?"
            value={form.reusable}
            onChange={(v) => {
              setForm((f) => ({ ...f, reusable: v }));
              setDirty(true);
            }}
            options={TRI_STATE.map((c) => ({
              value: c,
              label: TRI_STATE_LABELS[c],
            }))}
            error={errors.reusable}
          />
          <FormSelect
            id="returnConfirmed"
            label="Retour bevestigd?"
            value={form.returnConfirmed}
            onChange={(v) => {
              setForm((f) => ({ ...f, returnConfirmed: v }));
              setDirty(true);
            }}
            options={RETURN_CONFIRMED.map((c) => ({
              value: c,
              label: RETURN_CONFIRMED_LABELS[c],
            }))}
            error={errors.returnConfirmed}
            hint="Ja betekent controle voor dit project, geen algemene leveranciergarantie."
          />
          {form.returnConfirmed === "CHECK" ? (
            <p className="status-attention rounded px-2 py-1 text-sm">
              Nog controleren — retourroute nog niet vastleggen.
            </p>
          ) : null}
          <FormSelect
            id="recyclable"
            label="Recycling/verwerking?"
            value={form.recyclable}
            onChange={(v) => {
              setForm((f) => ({ ...f, recyclable: v }));
              setDirty(true);
            }}
            options={RECYCLABLE.map((c) => ({
              value: c,
              label: RECYCLABLE_LABELS[c],
            }))}
            error={errors.recyclable}
          />
          <FormSelect
            id="finalRoute"
            label="Definitieve route"
            value={form.finalRoute}
            onChange={(v) => {
              setForm((f) => ({ ...f, finalRoute: v }));
              setDirty(true);
            }}
            options={ASSESSMENT_ROUTES.map((c) => ({
              value: c,
              label: ASSESSMENT_ROUTE_LABELS[c],
            }))}
            emptyLabel="Nog te bepalen"
            error={errors.finalRoute}
            hint="C01/A03: vijf routes; leeg = nog open. Geen «Nog bepalen» als opslagwaarde."
          />
          <FormField id="storageLocation" label="Opslaglocatie indien nodig" error={errors.storageLocation}>
            <input
              id="storageLocation"
              className={inputClass}
              value={form.storageLocation}
              onChange={(e) => {
                setForm((f) => ({ ...f, storageLocation: e.target.value }));
                setDirty(true);
              }}
            />
          </FormField>
          <FormField id="followUpAction" label="Vervolgactie" error={errors.followUpAction}>
            <textarea
              id="followUpAction"
              className="w-full min-h-[88px] rounded border border-[#c5ced6] px-3 py-2"
              value={form.followUpAction}
              onChange={(e) => {
                setForm((f) => ({ ...f, followUpAction: e.target.value }));
                setDirty(true);
              }}
            />
          </FormField>
          <FormField id="responsible" label="Verantwoordelijke" error={errors.responsible}>
            <input
              id="responsible"
              className={inputClass}
              value={form.responsible}
              onChange={(e) => {
                setForm((f) => ({ ...f, responsible: e.target.value }));
                setDirty(true);
              }}
            />
          </FormField>

          {form.finalRoute && form.projectMaterialStreamId ? (
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.applyRouteToStream}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    applyRouteToStream: e.target.checked,
                  }));
                  setDirty(true);
                }}
              />
              <span>
                Definitieve route ook overnemen in Materiaalstromen voor deze
                gekoppelde stroom (expliciete keuze; niet automatisch bij
                meerdere beoordelingen).
              </span>
            </label>
          ) : null}

          <SaveBar saving={saving} saved={saved} errorSummary={summary} />
        </form>
      ) : null}
    </div>
  );
}
