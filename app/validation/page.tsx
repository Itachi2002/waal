import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ValidationForm } from "@/components/projects/ValidationForm";
import { getSessionUser } from "@/lib/auth/session";
import { getProductValidation } from "@/lib/services/validation-product";

export default async function ValidationPage() {
  if (!(await getSessionUser())) redirect("/login");
  const v = await getProductValidation();

  return (
    <div className="app-shell">
      <AppHeader showBackToProjects />
      <main className="app-main app-main--no-tabs">
        <h1 className="text-2xl font-semibold mb-2">
          Validatie beroepsproduct
        </h1>
        <div className="mb-5 surface-card !bg-[#fff8e8] text-sm">
          <p className="font-medium">Afbakening</p>
          <p className="mt-1 text-[#555]">
            Eenmalig onderzoeksformulier — geen projectprestatiemeting.
          </p>
        </div>
        <div className="surface-card">
          <ValidationForm
            initial={{
              revision: v.revision,
              testedBy: v.testedBy ?? "",
              role: v.role ?? "",
              date: v.date ?? "",
              projectSituation: v.projectSituation ?? "",
              clarityScore:
                v.clarityScore == null ? "" : String(v.clarityScore),
              practicalityScore:
                v.practicalityScore == null
                  ? ""
                  : String(v.practicalityScore),
              completenessScore:
                v.completenessScore == null
                  ? ""
                  : String(v.completenessScore),
              timeBurdenScore:
                v.timeBurdenScore == null ? "" : String(v.timeBurdenScore),
              wouldUse: v.wouldUse ?? "",
              fitsWaal: v.fitsWaal ?? "",
              keyFeedback: v.keyFeedback ?? "",
              processedChange: v.processedChange ?? "",
              remark: v.remark ?? "",
            }}
          />
        </div>
        <p className="mt-6 text-center">
          <Link href="/projects" className="text-sm text-[var(--waal-blue-dark)] underline">
            Terug naar projecten
          </Link>
        </p>
      </main>
    </div>
  );
}
