import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { connection } from "next/server";
import { readTheme } from "@/lib/design/store";
import { themeVariables } from "@/lib/design/theme";
import { ThemeProvider } from "@/components/theme-provider";
import "./foundations.css";
import "./globals.css";
import "./fleet.css";
import "./positioning.css";
import "./company.css";
import "./design-system.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://flymar.tech",
  ),
  title: "FLYMAR — A new perspective on water",
  description:
    "FLYMAR F8: the everyday electric hydrofoil for adventure, transport and freedom. FLYMAR F11: a dedicated commercial hydrofoil for cities and fleet operators.",
  openGraph: {
    title: "FLYMAR — A new perspective on water",
    description: "Electric. Intelligent. Elevated.",
    images: [{ url: "/media/hero.webp", width: 2400, height: 1350 }],
    type: "website",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const { theme } = await readTheme();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      style={themeVariables(theme) as CSSProperties}
    >
      <body>
        <ThemeProvider initial={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
