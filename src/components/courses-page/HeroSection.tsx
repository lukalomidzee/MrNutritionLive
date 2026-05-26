"use client";

import { Box } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSiteDetails } from "@/components/backend/hooks";
import HeroSectionClient from "./HeroSectionClient";

export default function HeroSection() {
    const { t, i18n } = useTranslation();
    const { items } = useSiteDetails();
    const isGeorgian = i18n.language === "ka";

    const coursesPage = useMemo(
        () => (items ?? []).find((item) => item.pageTypeName.toLowerCase() === "courses"),
        [items]
    );

    const title = isGeorgian
        ? coursesPage?.titleGeo || coursesPage?.title || t("mainTitleCoursesPage")
        : coursesPage?.title || coursesPage?.titleGeo || t("mainTitleCoursesPage");

    const subtitle = isGeorgian
        ? coursesPage?.subtitleGeo || coursesPage?.subtitle || t("secondaryTitleCoursesPage")
        : coursesPage?.subtitle || coursesPage?.subtitleGeo || t("secondaryTitleCoursesPage");

    const backgroundUrl = coursesPage?.backgroundUrl ?? null;
    const titleColor = coursesPage?.titleColor ?? null;
    const subtitleColor = coursesPage?.subtitleColor ?? null;

    return (
        <Box
            sx={{
                minHeight: { xs: "52vh", sm: "62vh", md: "72vh", lg: "82vh" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 3, sm: 4, md: 2 },
                px: { xs: 2, sm: 3, md: 5, lg: 8 },
                backgroundColor: backgroundUrl ? "transparent" : "var(--color-white)",
                backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                ...(backgroundUrl && {
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                        zIndex: 0,
                    },
                }),
            }}
        >
            <HeroSectionClient
                title={title}
                subtitle={subtitle}
                titleColor={titleColor}
                subtitleColor={subtitleColor}
            />
        </Box>
    );
}
