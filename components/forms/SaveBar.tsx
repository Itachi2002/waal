"use client";

export function SaveBar({
  saving,
  saved,
  errorSummary,
}: {
  saving: boolean;
  saved: boolean;
  errorSummary?: string | null;
}) {
  return (
    <div className="sticky bottom-[calc(var(--app-tab-h)+0.25rem)] md:bottom-0 z-30 mt-6 -mx-1 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e5ebf0] bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <button type="submit" className="btn btn-primary flex-1 md:flex-none" disabled={saving}>
        {saving ? "Opslaan…" : "Opslaan"}
      </button>
      {saved ? (
        <span className="text-[var(--waal-positive)] font-medium" role="status">
          Opgeslagen
        </span>
      ) : null}
      {errorSummary ? (
        <span className="w-full text-sm text-[#8b1a1a] md:w-auto" role="alert">
          {errorSummary}
        </span>
      ) : null}
    </div>
  );
}
