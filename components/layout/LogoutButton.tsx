"use client";

import { IconLogout } from "@/components/icons/Icons";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8dee5] bg-white text-[#555]"
      aria-label="Uitloggen"
      title="Uitloggen"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
    >
      <IconLogout className="h-5 w-5" />
    </button>
  );
}
