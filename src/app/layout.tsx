import type { Metadata } from "next";
import "./globals.css";
import "./fleet.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://flymar.tech",
  ),
  alternates: { languages: { en: "/", ru: "/ru" } },
  title: "FLYMAR — A new perspective on water",
  description:
    "Intelligent electric hydrofoils. Discover FLYMAR F8: quiet journeys, smooth flight and a smarter way to move your business forward.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
