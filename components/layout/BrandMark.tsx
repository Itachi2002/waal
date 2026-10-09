/**
 * Logo: plaats `public/brand/waal-logo.jpeg` (zie reference/README).
 * Zolang die ontbreekt: tekstplaceholder «Waal» (geen zelfbedacht logo).
 * Client-safe — geen filesystem-check in de browserbundel.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  const hasLogo = process.env.NEXT_PUBLIC_HAS_WAAL_LOGO === "true";

  if (hasLogo) {
    return (
      // Logo wordt ongewijzigd uit public/brand geserveerd (geen Next Image-optimalisatie/recolor).
      // eslint-disable-next-line @next/next/no-img-element -- bronasset ongewijzigd houden
      <img
        src="/brand/waal-logo.jpeg"
        alt="Waal"
        width={160}
        height={64}
        className={`h-12 w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <span
      className={`text-2xl font-bold tracking-tight text-[var(--waal-black)] ${className}`}
      aria-label="Waal"
    >
      Waal
    </span>
  );
}
