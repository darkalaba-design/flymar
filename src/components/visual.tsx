"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useSiteTheme } from "./theme-provider";
export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const theme = useSiteTheme();
  return (
    <motion.div
      className={className}
      initial={reduced || theme.motion === 0 ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0 : 0.8 * theme.motion,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
  unoptimized = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
}) {
  return (
    <Image
      src={`/media/${/\.(jpg|jpeg|png|webp)$/i.test(src) ? src : `${src}.webp`}`}
      unoptimized={unoptimized}
      alt={alt}
      fill
      sizes="(max-width: 760px) 100vw, 80vw"
      className={className}
      preload={priority}
    />
  );
}
