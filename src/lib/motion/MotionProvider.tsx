"use client";

import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Variants,
  type Transition,
} from "framer-motion";
import type { ReactNode, ElementType } from "react";

export interface MotionProviderProps {
  children: ReactNode;
  variants?: Variants;
  as?: ElementType;
  className?: string;
  transition?: Transition;
  presenceMode?: "sync" | "popLayout" | "wait";
  layout?: boolean | "position" | "size" | "preserve-aspect";
}

export default function MotionProvider({
  children,
  variants,
  as: Tag = "div",
  className,
  transition = { duration: 0.3, ease: "easeOut" },
  presenceMode = "wait",
  layout,
}: MotionProviderProps) {
  const MotionTag = motion(Tag as ElementType);
  const isServer = typeof window === "undefined";
  const initial = isServer ? false : "hidden";

  return (
    <MotionConfig>
      <AnimatePresence mode={presenceMode}>
        <MotionTag
          variants={variants}
          initial={initial}
          animate="visible"
          exit="exit"
          transition={transition}
          layout={layout}
          className={className}
          style={{ willChange: "transform, opacity" }}
        >
          {children}
        </MotionTag>
      </AnimatePresence>
    </MotionConfig>
  );
}
