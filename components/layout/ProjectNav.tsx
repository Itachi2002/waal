"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChart,
  IconClipboard,
  IconHome,
  IconLayers,
  IconSearch,
} from "@/components/icons/Icons";

const LINKS = [
  { href: "start", label: "Start", short: "Start", Icon: IconHome },
  { href: "quickscan", label: "Quickscan", short: "Scan", Icon: IconClipboard },
  { href: "streams", label: "Stromen", short: "Stromen", Icon: IconLayers },
  {
    href: "assessments",
    label: "Beoordeling",
    short: "Beoord.",
    Icon: IconSearch,
  },
  { href: "evaluation", label: "Evaluatie", short: "Eval", Icon: IconChart },
];

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const q = `?id=${encodeURIComponent(projectId)}`;

  return (
    <>
      <nav
        aria-label="Projectstappen"
        className="hidden md:block border-b border-[#e5ebf0] bg-white px-3 py-2"
      >
        <ul className="flex flex-wrap gap-1.5">
          {LINKS.map((l) => {
            const href = `/projects/${l.href}/${q}`;
            const active = pathname?.includes(`/projects/${l.href}`);
            const Icon = l.Icon;
            return (
              <li key={l.href}>
                <Link
                  href={href}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium ${
                    active
                      ? "bg-[var(--waal-blue-dark)] text-white"
                      : "bg-[var(--waal-gray)] text-[var(--waal-text)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        aria-label="Projectstappen"
        className="md:hidden fixed bottom-0 left-1/2 z-50 w-full max-w-[var(--app-max)] -translate-x-1/2 border-t border-[#e5ebf0] bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(28,28,28,0.06)]"
      >
        <ul className="grid grid-cols-5">
          {LINKS.map((l) => {
            const href = `/projects/${l.href}/${q}`;
            const active = pathname?.includes(`/projects/${l.href}`);
            const Icon = l.Icon;
            return (
              <li key={l.href}>
                <Link
                  href={href}
                  className={`flex h-[var(--app-tab-h)] flex-col items-center justify-center gap-1 px-0.5 text-center text-[0.65rem] font-semibold leading-tight ${
                    active
                      ? "text-[var(--waal-blue-dark)]"
                      : "text-[#7a8490]"
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${
                      active ? "bg-[#e8f3fa]" : "bg-transparent"
                    }`}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  {l.short}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
