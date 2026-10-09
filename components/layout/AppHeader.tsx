import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { IconFolder } from "@/components/icons/Icons";

export function AppHeader({
  projectName,
  scanResponsible,
  showBackToProjects = false,
}: {
  projectName?: string | null;
  scanResponsible?: string | null;
  showBackToProjects?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e5ebf0] bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between gap-3 px-3 py-3 min-h-[var(--app-header-h)]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/projects"
            className="shrink-0 rounded-xl focus-visible:outline-offset-4"
            aria-label="Naar projecten"
          >
            <BrandMark size="lg" />
          </Link>
          {projectName ? (
            <div className="min-w-0 border-l border-[#e5ebf0] pl-3">
              <p className="truncate text-[0.95rem] font-semibold leading-tight">
                {projectName}
              </p>
              {scanResponsible ? (
                <p className="truncate text-xs text-[#666] mt-0.5">
                  Scan: {scanResponsible}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="min-w-0 text-sm font-medium text-[#555]">
              Projectscan
            </p>
          )}
        </div>
        {showBackToProjects ? (
          <Link
            href="/projects"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8dee5] bg-white text-[var(--waal-blue-dark)]"
            aria-label="Alle projecten"
            title="Projecten"
          >
            <IconFolder className="h-5 w-5" />
          </Link>
        ) : null}
      </div>
    </header>
  );
}
