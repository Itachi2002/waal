"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  IconAlert,
  IconCheck,
  IconEdit,
  IconInfo,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@/components/icons/Icons";
import {
  ConflictError,
  FieldValidationError,
  store,
} from "@/lib/client/store";

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
  assessments: initialAssessments,
  streams: initialStreams,
}: {
  projectId: string;
  assessments: Assessment[];
  streams: StreamOpt[];
}) {
  const search = useSearchParams();
  const prelink = search.get("stream") || "";
  const [assessments, setAssessments] = useState(initialAssessments);
  const [streams, setStreams] = useState(initialStreams);
  const [editingId, setEditingId] = useState<string | null>(null);

  function reload() {
    setAssessments(store.listAssessments(projectId) as Assessment[]);
    setStreams(
      store.getStreams(projectId).map((s) => ({
        id: s.id,
        streamCode: s.streamCode,
        revision: s.revision,
      })),
    );
  }
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

  function onSubmit(e: FormEvent) {
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
    try {
      const assessment = editingId
        ? store.updateAssessment(projectId, editingId, payload)
        : store.createAssessment(projectId, payload);
      setDirty(false);
      setSaved(true);
      if (!editingId) setEditingId(assessment.id);
      setForm((f) => ({ ...f, revision: assessment.revision }));
      reload();
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

  function onDelete(id: string) {
    if (!confirm("Deze beoordeling verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
      return;
    }
    try {
      store.deleteAssessment(projectId, id);
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
      }
      reload();
    } catch {
      setSummary("Verwijderen mislukt.");
    }
  }

  const inputClass = "input-app";

  const tips = [
    "Is het materiaal technisch en praktisch bruikbaar?",
    "Is retour voor dit project bevestigd door leverancier/producent?",
    "Is het schoon en gescheiden te verwerken?",
  ];

  return (
    <div className="space-y-5">
      <div className="info-banner">
        <IconInfo className="mt-0.5 h-5 w-5 shrink-0 text-[var(--waal-blue-dark)]" />
        <p>
          Alleen bij extra beoordeling van een specifiek materiaal. Retour alleen
          bij bevestiging Ja voor dit project. Geen automatische routekeuze.
        </p>
      </div>

      <section className="surface-card !bg-[var(--waal-gray)] !border-0">
        <h2 className="section-title mb-3">Beslisvragen</h2>
        <ul className="space-y-2.5">
          {tips.map((t, i) => (
            <li
              key={t}
              className="flex gap-3 rounded-xl bg-white px-3 py-2.5 text-sm leading-snug"
            >
              <span className="step-badge">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Beoordelingen</h2>
        <button
          type="button"
          className="btn btn-primary !min-h-11 gap-2 !px-3.5 text-sm"
          onClick={startNew}
          aria-label="Nieuwe beoordeling"
        >
          <IconPlus className="h-4 w-4" />
          Nieuw
        </button>
      </div>

      <ul className="space-y-3">
        {assessments.length === 0 ? (
          <li className="empty-state">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3fa] text-[var(--waal-blue-dark)]">
              <IconSearch className="h-6 w-6" />
            </span>
            <p className="font-medium">Nog geen beoordelingen</p>
            <p className="text-sm text-[#666]">
              Tik op Nieuw om een materiaal te beoordelen.
            </p>
          </li>
        ) : (
          assessments.map((a) => {
            const streamLabel = a.projectMaterialStream
              ? MATERIAL_STREAMS.find(
                  (m) => m.code === a.projectMaterialStream!.streamCode,
                )?.label
              : null;
            const routeLabel = a.finalRoute
              ? ASSESSMENT_ROUTE_LABELS[
                  a.finalRoute as keyof typeof ASSESSMENT_ROUTE_LABELS
                ]
              : "Nog te bepalen";
            return (
              <li key={a.id} className="surface-card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">
                      {a.materialType || "Zonder materiaalomschrijving"}
                    </p>
                    <p className="mt-1 text-sm text-[#666]">
                      {streamLabel ?? "Geen stroomkoppeling"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      a.finalRoute
                        ? "status-yes"
                        : "status-attention"
                    }`}
                  >
                    {a.finalRoute ? (
                      <IconCheck className="h-3.5 w-3.5" />
                    ) : (
                      <IconAlert className="h-3.5 w-3.5" />
                    )}
                    {routeLabel}
                  </span>
                </div>
                {a.returnConfirmed === "CHECK" ? (
                  <p className="status-attention inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium">
                    <IconAlert className="h-3.5 w-3.5" />
                    Retour nog controleren
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary flex-1 gap-2 !min-h-11 text-sm"
                    onClick={() => startEdit(a)}
                  >
                    <IconEdit className="h-4 w-4" />
                    Bewerken
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary gap-2 !min-h-11 !px-3 text-sm"
                    onClick={() => onDelete(a.id)}
                    aria-label="Verwijderen"
                  >
                    <IconTrash className="h-4 w-4" />
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
          className="surface-card space-y-3 !border-[var(--waal-blue)]/30"
          noValidate
        >
          <h3 className="section-title">
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
              className="input-app min-h-[88px]"
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
