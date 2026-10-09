"use client";

import { useRouter } from "next/navigation";
import { IconLogout } from "@/components/icons/Icons";

/** Geen server-login: knop brengt terug naar de projectlijst. */
export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8dee5] bg-white text-[#555]"
      aria-label="Naar projecten"
      title="Projecten"
      onClick={() => router.push("/projects/")}
    >
      <IconLogout className="h-5 w-5" />
    </button>
  );
}
