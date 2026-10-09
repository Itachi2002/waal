import { redirect } from "next/navigation";

/** Login is uitgeschakeld voor de demo — doorsturen naar projecten. */
export default function LoginPage() {
  redirect("/projects");
}
