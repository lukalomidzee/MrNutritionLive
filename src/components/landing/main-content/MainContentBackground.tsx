"use client";

import { motion } from "framer-motion";

type Props = {
    backgroundUrl: string | null;
};

const MainContentBackground = ({ backgroundUrl }: Props) => {
    if (!backgroundUrl) return null;

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0 }}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                overflow: "clip",
                willChange: "transform",
            }}
        >
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${backgroundUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.45)",
                }}
            />
        </motion.div>
    );
};

export default MainContentBackground;
