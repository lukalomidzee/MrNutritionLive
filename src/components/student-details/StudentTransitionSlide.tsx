"use client";

import React, { useMemo } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";
import type { StudentDTO, AuthorSocialLinkDTO } from "@/components/backend/types";

const DEFAULT_SOCIAL_ORDER = ["instagram", "youtube", "tiktok", "facebook"] as const;

function normalizeSocialType(value: string | null | undefined): string {
    return (value ?? "").trim().toLowerCase();
}

function sortSocialLinks(items: AuthorSocialLinkDTO[]): AuthorSocialLinkDTO[] {
    const hasExplicitSort = items.some((item) => item.sortOrder !== null && item.sortOrder !== undefined);

    if (hasExplicitSort) {
        return items.slice().sort((a, b) => {
            const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;

            if (orderA !== orderB) return orderA - orderB;
            return (a.linkTypeName ?? "").localeCompare(b.linkTypeName ?? "");
        });
    }

    const priority = new Map<string, number>(
        DEFAULT_SOCIAL_ORDER.map((name, index) => [name, index])
    );

    return items.slice().sort((a, b) => {
        const rankA = priority.get(normalizeSocialType(a.linkTypeName)) ?? Number.MAX_SAFE_INTEGER;
        const rankB = priority.get(normalizeSocialType(b.linkTypeName)) ?? Number.MAX_SAFE_INTEGER;

        if (rankA !== rankB) return rankA - rankB;
        return (a.linkTypeName ?? "").localeCompare(b.linkTypeName ?? "");
    });
}

export default function StudentTransitionSlide({ student }: Readonly<{ student: StudentDTO }>) {
    const { i18n } = useTranslation();
    const isGeorgian = i18n.language === "ka";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const socials = useMemo(
        () =>
            sortSocialLinks(
                (student.socialLinks ?? []).filter(
                    (item) =>
                        Boolean(item.linkUrl) &&
                        normalizeSocialType(item.linkTypeName) === "instagram"
                )
            ).map((item) => ({
                id: item.id,
                href: item.linkUrl,
            })),
        [student.socialLinks]
    );

    if (socials.length === 0) {
        return (
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 2,
                    fontFamily: "Livvic, sans-serif",
                    color: "#fff",
                }}
            >
                <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
                    {isGeorgian ? "სოციალური ქსელები არ არის დამატებული" : "No Instagram link available"}
                </Typography>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.6)",
                zIndex: 2,
                overflow: "visible",
                fontFamily: "Livvic, sans-serif",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: isMobile ? "-16vw" : "-5vw",
                    top: 0,
                    width: isMobile ? "30vw" : "20vw",
                    height: "100%",
                    background: "#0b0b0b",
                    borderTopRightRadius: "100% 100%",
                    borderBottomRightRadius: "100% 100%",
                    transform: isMobile ? "scaleY(1.25)" : "scaleY(1.5)",
                }}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 2,
                    maxWidth: 900,
                    width: "100%",
                    px: { xs: 4, md: 2 },
                }}
            >
                {socials.map((s) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="a"
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                width: isMobile ? 155 : 340,
                                height: isMobile ? 140 : 240,
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(145deg, rgba(30,30,30,1), rgba(15,15,15,1))",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                                overflow: "hidden",
                                cursor: "pointer",
                                transition: "transform 0.4s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textDecoration: "none",
                                "&:hover": {
                                    transform: isMobile ? "none" : "translateY(-10px) scale(1.03)",
                                },
                            }}
                        >
                            <Stack direction="column" alignItems="center" justifyContent="center" spacing={1.5}>
                                <Box sx={{ fontSize: isMobile ? 30 : 46, color: "var(--color-orange)" }}>
                                    <FaInstagram />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: isMobile ? 14 : 22,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        color: "#fff",
                                        letterSpacing: 1,
                                    }}
                                >
                                    Instagram
                                </Typography>
                            </Stack>
                        </Box>
                    </motion.div>
                ))}
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    right: isMobile ? "-16vw" : "-5vw",
                    top: 0,
                    width: isMobile ? "30vw" : "20vw",
                    height: "100%",
                    background: "#0b0b0b",
                    borderTopLeftRadius: "100% 100%",
                    borderBottomLeftRadius: "100% 100%",
                    transform: isMobile ? "scaleY(1.25)" : "scaleY(1.5)",
                }}
            />
        </motion.div>
    );
}
