import type { Metadata } from "next";
import { Home } from "@/components/home";
export const metadata: Metadata = {
  title: "FLYMAR — Новый взгляд на движение по воде",
  description:
    "Умные электрические суда на подводных крыльях. FLYMAR F8: комфорт пассажиров и эффективность вашего бизнеса.",
};
export default function Page() {
  return <Home locale="ru" />;
}
