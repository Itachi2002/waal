import { redirect } from "next/navigation";

/** Login is uitgeschakeld voor de GitHub Pages-demo. */
export default function LoginPage() {
  redirect("/projects/");
}
