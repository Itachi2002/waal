import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { LogoutButton } from "./LogoutButton";

export function AppHeader({
  projectName,
  scanResponsible,
}: {
  projectName?: string | null;
  scanResponsible?: string | null;
}) {
  return (
    <header className="border-b border-[#d8dee5] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="shrink-0">
            <BrandMark />
          </Link>
          <div className="hidden sm:block">
            <p className="text-sm text-[#555]">Afval- en reststromen projectscan</p>
            {projectName ? (
              <p className="font-semibold text-[var(--waal-text)]">
                {projectName}
                {scanResponsible ? (
                  <span className="font-normal text-[#555]">
                    {" "}
                    · {scanResponsible}
                  </span>
                ) : null}
              </p>
            ) : null}
          </div>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
