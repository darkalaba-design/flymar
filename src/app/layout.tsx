import type { Metadata } from "next";
import "./globals.css";
import "./fleet.css";
import "./positioning.css";
import "./company.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://flymar.tech",
  ),
  alternates: { languages: { en: "/", ru: "/ru" } },
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
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
