// src/components/motion/MotionBase.tsx
"use client";

import {
  motion,
  useInView,
  type Variants,
  type Transition,
} from "framer-motion";
import type { ReactNode, ElementType, CSSProperties, Ref } from "react";
import { useEffect, useRef, useState } from "react";

export type Viewport = {
  once?: boolean;
  amount?: "some" | "all" | number;
  /** IntersectionObserver rootMargin (e.g. "0px 0px -20% 0px") */
  margin?: string;
};

export interface MotionBaseProps {
  children: ReactNode;
  variants: Variants;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  transition?: Transition;
  delay?: number;
  /** Keep these defaults so wrappers can be used with no props */
  initial?: "hidden" | false;
  whileInView?: "visible";
  exit?: "exit";
  viewport?: Viewport;
  /** SSR/LCP safety: render visible HTML on the server & first paint */
  ssrSafe?: boolean;
}

/**
 * MotionBase
 * - SSR/hydration: visible HTML (initial=false) to protect SEO/LCP
 * - Client:
 *    • If in view at mount  → visible
 *    • If not in view       → hidden (reveals via whileInView)
 */
export default function MotionBase({
  children,
  variants,
  as: Tag = "div",
  className,
  style,
  transition = { duration: 0.3, ease: "easeOut" },
  delay = 0,
  initial = "hidden",
  whileInView = "visible",
  exit = "exit",
  viewport = { once: true, amount: 0.2 },
  ssrSafe = true,
}: MotionBaseProps) {
  const MotionTag = motion.create(Tag as ElementType);

  // Ref typed as a generic Element to accommodate any tag
  const ref = useRef<Element | null>(null);

  // Build options without `margin` unless provided to avoid TS mismatch
  type InViewOpts = NonNullable<Parameters<typeof useInView>[1]>;
  const inViewOptions: InViewOpts = {
    once: viewport.once ?? true,
    amount: viewport.amount ?? 0.2,
    ...(viewport.margin
      ? { margin: viewport.margin as InViewOpts["margin"] }
      : {}),
  };

  const inView = useInView(ref, inViewOptions);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // SSR-safe initial:
  // - Server & first client paint: visible (false)
  // - After mount:
  //    • if inView => visible
  //    • else      => hidden (so whileInView can reveal)
  let effectiveInitial: "hidden" | false = initial;
  if (ssrSafe) {
    if (!mounted) {
      effectiveInitial = false;
    } else {
      effectiveInitial = inView ? false : "hidden";
    }
  }

  return (
    <MotionTag
      ref={ref as Ref<Element>}
      variants={variants}
      initial={effectiveInitial}
      whileInView={whileInView}
      exit={exit}
      viewport={viewport}
      transition={{ ...transition, delay }}
      className={className}
      style={{ willChange: "transform, opacity", width: "100%", ...style }}
    >
      {children}
    </MotionTag>
  );
}
