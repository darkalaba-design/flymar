import type { Metadata } from "next";
import { Home } from "@/components/home";
export const metadata: Metadata = {
  title: "FLYMAR — Новый взгляд на движение по воде",
  description:
    "FLYMAR F8 — электрическое судно для приключений, поездок и работы на воде. FLYMAR F11 — коммерческая транспортная платформа для городов и операторов флота.",
};
export default function Page() {
  return <Home locale="ru" />;
}
