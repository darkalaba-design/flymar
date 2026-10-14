import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Home } from "@/components/home";
import { productCopy, type ModelId } from "@/lib/fleet";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ model: "f8" }, { model: "f11" }];
}
type Props = { params: Promise<{ model: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  if (model !== "f8" && model !== "f11") notFound();
  return {
    title: `FLYMAR ${model.toUpperCase()} — ${productCopy.ru[model].eyebrow}`,
    description: productCopy.ru[model].intro,
    alternates: {
      canonical: `/ru/models/${model}`,
      languages: { en: `/models/${model}`, ru: `/ru/models/${model}` },
    },
    openGraph: {
      title: `FLYMAR ${model.toUpperCase()}`,
      description: productCopy.ru[model].intro,
      images: [`/media/${model === "f8" ? "f8-boarding" : "f11-profile"}.webp`],
    },
  };
}
export default async function Page({ params }: Props) {
  const { model } = await params;
  if (model !== "f8" && model !== "f11") notFound();
  return <Home key={model} model={model as ModelId} locale="ru" />;
}
