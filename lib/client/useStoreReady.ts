"use client";

import { useEffect, useState } from "react";

/** Voorkomt SSR/hydration-mismatch: localStorage bestaat pas in de browser. */
export function useStoreReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}
