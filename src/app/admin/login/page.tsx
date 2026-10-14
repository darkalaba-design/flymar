import { redirect } from "next/navigation";
import { readSession } from "@/lib/admin/security";
import { AdminLogin } from "@/components/admin/login";
export default async function LoginPage() {
  let loggedIn = false;
  try {
    loggedIn = !!(await readSession());
  } catch {}
  if (loggedIn) redirect("/admin");
  return <AdminLogin />;
}
