import type { Metadata } from "next";
import { readTheme } from "@/lib/design/store";
import { readSession } from "@/lib/admin/security";
import { UiKit } from "@/components/ui-kit/ui-kit";
export const metadata: Metadata = {
  title: "FLYMAR / UI Kit",
  robots: { index: false, follow: false },
};
export default async function UiKitPage() {
  const snapshot = await readTheme();
  let authenticated = false;
  try {
    authenticated = !!(await readSession());
  } catch {}
  return <UiKit snapshot={snapshot} authenticated={authenticated} />;
}
