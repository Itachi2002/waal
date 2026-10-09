"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/layout/BrandMark";
import { Suspense } from "react";

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
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-4 rounded-md border border-[#d8dee5] bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold">Lokale aanmelding</h1>
      <p className="text-sm text-[#555]">
        Eén lokale beheerder. Geen zelfregistratie.
      </p>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Gebruikersnaam
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          className="mt-1 w-full min-h-[44px] rounded border border-[#c5ced6] px-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full min-h-[44px] rounded border border-[#c5ced6] px-3"
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f5f7f9_55%,#e8eef3_100%)] flex flex-col items-center justify-center gap-8 p-6">
      <BrandMark />
      <Suspense fallback={<p>Laden…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
