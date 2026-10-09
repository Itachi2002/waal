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
    <div>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="mb-2">
          <Link href="/projects" className="text-sm text-[var(--waal-blue-dark)] underline">
            ← Terug naar projecten
          </Link>
        </p>
        <h1 className="text-2xl font-semibold mb-2">
          Validatie beroepsproduct
        </h1>
        <div className="mb-6 rounded-md border border-[#d8dee5] bg-[#fff8e8] p-4 text-sm">
          <p className="font-medium">Afbakening</p>
          <p>
            Dit is een eenmalig onderzoeksformulier voor validatie van het
            beroepsproduct tijdens het afstudeeronderzoek. Het is geen
            doorlopende projectprestatiemeting en geen verplichte stap voor ieder
            woningbouwproject.
          </p>
        </div>
        <div className="rounded-md border border-[#d8dee5] bg-white p-6">
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
      </main>
    </div>
  );
}
