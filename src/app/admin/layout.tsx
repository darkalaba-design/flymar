import type { Metadata } from "next";
import "./admin.css";
export const metadata: Metadata = {
  title: "FLYMAR / Управление",
  robots: { index: false, follow: false },
  alternates: { canonical: null, languages: {} },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-app" lang="ru">
      {children}
    </div>
  );
}
