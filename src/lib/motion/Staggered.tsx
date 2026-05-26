"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem } from "./variants";

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export function StaggeredList({
  children,
  className,
  variants = staggerContainer,
}: StaggeredListProps) {
  const isServer = typeof window === "undefined";
  const initial = isServer ? false : "hidden"; // SSR-safe

  return (
    <motion.ul
      variants={variants}
      initial={initial}
      animate="visible"
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.ul>
  );
}

export function StaggeredItem({
  children,
  className,
  variants = staggerItem,
}: StaggeredItemProps) {
  return (
    <motion.li variants={variants} className={className}>
      {children}
    </motion.li>
  );
}
