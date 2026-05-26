"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FadeIn from "@/lib/motion/FadeIn";

type Props = {
    title: string;
    subtitle: string;
    titleColor: string | null;
    subtitleColor: string | null;
};

const MainContentClient: React.FC<Props> = ({ title, subtitle, titleColor, subtitleColor }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{
                    duration: 20,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    willChange: "transform",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    zIndex: 2,
                    textAlign: "center",
                    px: 2,
                }}
            >
                <FadeIn>
                    <Typography
                        variant="h1"
                        sx={{
                            pb: 2,
                            fontFamily: "Noto Sans Georgian, sans-serif",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            fontSize: {
                                xs: "3rem",
                                sm: "4.5rem",
                                md: "6rem",
                                lg: "7.5rem",
                                xl: "8rem",
                            },
                            textTransform: "uppercase",
                            textShadow: `
                0 0 25px rgba(255,255,255,0.35),
                0 0 60px rgba(255,255,255,0.25),
                0 0 90px rgba(255,255,255,0.15)
              `,
                            ...(titleColor
                                ? { color: titleColor }
                                : {
                                    background: "linear-gradient(90deg, #ffffff, #e2ffb3, #ffffff)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }),
                            animation: "shine 6s ease-in-out infinite",
                            "@keyframes shine": {
                                "0%": { filter: "brightness(1)" },
                                "50%": { filter: "brightness(1.6)" },
                                "100%": { filter: "brightness(1)" },
                            },
                        }}
                    >
                        {title || t("ourBigFamily")}
                    </Typography>
                </FadeIn>
                {subtitle && (
                    <FadeIn>
                        <Typography
                            variant="h5"
                            sx={{
                                mt: 1,
                                color: subtitleColor || "rgba(255,255,255,0.95)",
                                fontFamily: "Noto Sans Georgian, sans-serif",
                                fontWeight: 600,
                                maxWidth: 900,
                                mx: "auto",
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </FadeIn>
                )}
            </Box>
        </>
    );
};

export default MainContentClient;
