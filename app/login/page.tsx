"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/layout/BrandMark";

function LoginForm() {
  const search = useSearchParams();
  const next = search.get("next") || "/projects";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Inloggen mislukt.");
        setLoading(false);
        return;
      }
      window.location.href = next;
    } catch {
      setError("Inloggen mislukt. Probeer opnieuw.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4" noValidate>
      <div>
        <h1 className="text-xl font-semibold text-[var(--waal-black)]">
          Lokale aanmelding
        </h1>
        <p className="mt-1 text-sm text-[#666]">
          Eén lokale beheerder. Geen zelfregistratie.
        </p>
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Gebruikersnaam
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          className="input-app"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="input-app"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Bezig…" : "Inloggen"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="app-shell !shadow-none">
      <div className="flex flex-1 flex-col justify-center px-5 py-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size="lg" />
          <p className="mt-4 text-base font-semibold text-[var(--waal-black)]">
            Afval- en reststromen
          </p>
          <p className="mt-1 text-sm text-[#666]">Projectscan voor op de bouw</p>
        </div>
        <div className="surface-card !border-0 !bg-[var(--waal-gray)]">
          <Suspense fallback={<p>Laden…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
