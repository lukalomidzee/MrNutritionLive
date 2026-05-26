"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useSiteDetails } from "@/components/backend/hooks";

export default function HeroSection() {
    const { t, i18n } = useTranslation();
    const { items } = useSiteDetails();
    const isGeorgian = i18n.language === "ka";

    const studentsPage = useMemo(
        () => (items ?? []).find((item) => item.pageTypeName.toLowerCase() === "students"),
        [items]
    );

    const title = isGeorgian
        ? studentsPage?.titleGeo || studentsPage?.title || t("celebrateSuccessTogether")
        : studentsPage?.title || studentsPage?.titleGeo || t("celebrateSuccessTogether");

    const subtitle = isGeorgian
        ? studentsPage?.subtitleGeo || studentsPage?.subtitle || ""
        : studentsPage?.subtitle || studentsPage?.subtitleGeo || "";

    const backgroundUrl = studentsPage?.backgroundUrl ?? null;
    const titleColor = studentsPage?.titleColor ?? null;
    const subtitleColor = studentsPage?.subtitleColor ?? null;

    return (
        <Box sx={{ mt: "100px", backgroundColor: "var(--color-white)" }}>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: "40vh", sm: "60vh", md: "80vh", lg: "88vh" },
                    backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: backgroundUrl ? "transparent" : "var(--color-white)",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: backgroundUrl ? "rgba(0,0,0,0.4)" : "transparent",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "start",
                        color: titleColor || "var(--color-white)",
                        textAlign: "center",
                        py: 10,
                        px: { xs: 2, sm: 5, md: 7, lg: 17 },
                    }}
                >
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: "bold",
                                textAlign: "end",
                                fontSize: { xs: "2.5rem", sm: "4rem", md: "6rem", xl: "8rem" },
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="h4"
                                sx={{
                                    mt: 2,
                                    fontWeight: 600,
                                    textAlign: "end",
                                    color: subtitleColor || "var(--color-orange)",
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </motion.div>
                </Box>
                <Box
                    component="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 150"
                    sx={{ position: "absolute", bottom: 0, width: "100%" }}
                >
                    <path fill="var(--color-white)" d="M0,96 C360,192 1080,0 1440,96 L1440,160 L0,160 Z" />
                </Box>
            </Box>
        </Box>
    );
}
