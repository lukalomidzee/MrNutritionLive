"use client";

import {motion, useAnimationControls, type Variants} from "framer-motion";
import type {ReactNode} from "react";
import {useLayoutEffect} from "react";
import {fadeVariants} from "./variants";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    variants?: Variants;
}

export default function FadeIn({
                                   children,
                                   className,
                                   variants = fadeVariants,
                               }: FadeInProps) {
    const controls = useAnimationControls();
    const ease: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

    useLayoutEffect(() => {
        if ("ready" in variants) {
            controls.set("ready");
            requestAnimationFrame(() => controls.start("visible"));
        } else {
            controls.start("visible");
        }
    }, [controls, variants]);

    return (
        <motion.div
            initial={{opacity: 0, x: -50}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.8, ease}}
            viewport={{once: true}}
        >
            {children}
        </motion.div>
    );
}
