"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "start", label: "Projectstart" },
  { href: "quickscan", label: "Quickscan" },
  { href: "streams", label: "Materiaalstromen" },
  { href: "assessments", label: "Materiaalbeoordeling" },
  { href: "evaluation", label: "Evaluatie" },
];

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Projectstappen" className="bg-white border border-[#d8dee5] rounded-md">
      <button
        type="button"
        className="btn btn-secondary m-2 w-[calc(100%-1rem)] md:hidden"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Sluit navigatie" : "Projectnavigatie"}
      </button>
      <ul className={`${open ? "block" : "hidden"} md:block p-2 space-y-1`}>
        {LINKS.map((l) => {
          const href = `/projects/${projectId}/${l.href}`;
          const active = pathname?.includes(`/${l.href}`);
          return (
            <li key={l.href}>
              <Link
                href={href}
                className={`block rounded px-3 py-3 min-h-[44px] ${
                  active
                    ? "bg-[var(--waal-blue-dark)] text-white font-semibold"
                    : "hover:bg-[var(--waal-gray)]"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
        <li className="pt-2 border-t border-[#e5e9ee] mt-2">
          <Link
            href="/projects"
            className="block rounded px-3 py-3 min-h-[44px] text-sm text-[#555] hover:bg-[var(--waal-gray)]"
          >
            ← Alle projecten
          </Link>
        </li>
        <li>
          <Link
            href="/validation"
            className="block rounded px-3 py-3 min-h-[44px] text-sm text-[#555] hover:bg-[var(--waal-gray)]"
          >
            Onderzoeksvalidatie (apart)
          </Link>
        </li>
      </ul>
    </nav>
  );
}
