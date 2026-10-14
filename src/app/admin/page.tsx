import { redirect } from "next/navigation";
import { readSession } from "@/lib/admin/security";
import { AdminDashboard } from "@/components/admin/dashboard";
export default async function AdminPage() {
  let loggedIn = false;
  try {
    loggedIn = !!(await readSession());
  } catch {}
  if (!loggedIn) redirect("/admin/login");
  return <AdminDashboard />;
}
