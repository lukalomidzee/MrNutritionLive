"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import React from "react";

export default function StudentHeroSection({ student, getLang }: any) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const firstName = getLang(student.firstNameGeo, student.firstName);
    const about = getLang(student.aboutGeo, student.about);

    return (
        <section
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0b0b0b",
                color: "#fff",
                overflow: "hidden",
                padding: isMobile ? "88px 16px 24px" : "0 24px",
            }}
        >
            <Box
                sx={{
                    textAlign: "left",
                    width: "fit-content",
                    maxWidth: "calc(100vw - 32px)",
                    overflow: "visible",
                    paddingBottom: isMobile ? "10px" : "40px",
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: isMobile ? "clamp(2rem, 12vw, 2.8rem)" : "clamp(3rem, 9vw, 7rem)",
                            fontWeight: 800,
                            lineHeight: 1.08,
                            letterSpacing: "0.04em",
                            fontFamily: "Noto Sans Georgian, Inter, sans-serif",
                        }}
                    >
                        <span style={{ display: "block" }}>
                            <motion.span
                                initial={{ y: 70, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.9 }}
                                style={{
                                    display: "inline-block",
                                    color: "var(--color-orange)",
                                    textShadow: isMobile ? "4px 4px #2a2a2a" : "8px 8px #2a2a2a",
                                }}
                            >
                                {t("hello")}
                                <span style={{ color: "var(--color-orange)" }}>.</span>
                            </motion.span>
                        </span>

                        <span style={{ display: "block" }}>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "clamp(10px, 2vw, 26px)",
                                    flexWrap: "nowrap",
                                }}
                            >
                                <motion.span
                                    initial={{ y: 70, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.9 }}
                                    style={{
                                        display: "inline-block",
                                        color: "var(--color-orange)",
                                        textShadow: isMobile ? "4px 4px #2a2a2a" : "8px 8px #2a2a2a",
                                    }}
                                >
                                    {t("iam")}
                                </motion.span>

                                {about && (
                                    <motion.span
                                        initial={{ x: 60, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.7 }}
                                        style={{
                                            display: "inline-block",
                                            maxWidth: isMobile ? "42vw" : "min(46vw, 420px)",
                                            fontSize: isMobile ? "10px" : "clamp(10px, 1vw, 12px)",
                                            lineHeight: isMobile ? "18px" : "20px",
                                            color: "#fff",
                                            textShadow: "none",
                                            textAlign: "left",
                                        }}
                                    >
                                        {about}
                                    </motion.span>
                                )}
                            </span>
                        </span>

                        <span style={{ display: "block" }}>
                            <motion.span
                                initial={{ y: 70, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.9 }}
                                style={{
                                    display: "inline-block",
                                    color: "var(--color-orange)",
                                    textShadow: isMobile ? "4px 4px #2a2a2a" : "8px 8px #2a2a2a",
                                }}
                            >
                                {firstName}
                            </motion.span>
                        </span>
                    </h1>
                </Box>

            </Box>
        </section>
    );
}
