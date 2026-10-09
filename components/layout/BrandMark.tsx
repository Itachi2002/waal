"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/base-path";

/**
 * Meegeleverd Waal-logo ongewijzigd (geen recolor/stretch).
 * Bij ontbrekende asset: tekstplaceholder «Waal».
 */
export function BrandMark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const height =
    size === "lg" ? "h-16 sm:h-[4.75rem]" : size === "sm" ? "h-12" : "h-14";

  if (failed) {
    return (
      <span
        className={`font-bold tracking-tight text-[var(--waal-black)] ${
          size === "lg" ? "text-4xl" : size === "sm" ? "text-2xl" : "text-3xl"
        } ${className}`}
        aria-label="Waal"
      >
        Waal
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- bronlogo ongewijzigd houden
    <img
      src={withBasePath("/brand/waal-logo.jpeg")}
      alt="Waal"
      width={220}
      height={88}
      className={`${height} w-auto max-w-[240px] object-contain object-left ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
