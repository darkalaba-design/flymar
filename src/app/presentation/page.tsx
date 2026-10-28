import type { Metadata } from "next";
import { Presentation } from "./presentation";

export const metadata: Metadata = {
  title: "FLYMAR / Presentation",
  description: "Electric hydrofoils. Autonomy First. F8 and F11.",
  robots: { index: false, follow: false },
};

export default function PresentationPage() {
  return <Presentation />;
}
