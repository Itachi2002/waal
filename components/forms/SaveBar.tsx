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
    <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-[#d8dee5] bg-white/95 p-4">
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Opslaan…" : "Opslaan"}
      </button>
      {saved ? (
        <span className="text-[var(--waal-positive)] font-medium" role="status">
          Opgeslagen
        </span>
      ) : null}
      {errorSummary ? (
        <span className="text-[#8b1a1a]" role="alert">
          {errorSummary}
        </span>
      ) : null}
    </div>
  );
}
