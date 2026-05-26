"use client";

import { Box } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSiteDetails } from "@/components/backend/hooks";
import MainContentClient from "./MainContentClient";
import MainContentBackground from "./MainContentBackground";

const MainContent = () => {
    const { items } = useSiteDetails();
    const { i18n, t } = useTranslation();
    const isGeorgian = i18n.language === "ka";

    const mainPage = useMemo(
        () => (items ?? []).find((item) => item.pageTypeName.toLowerCase() === "main"),
        [items]
    );

    const title = isGeorgian
        ? mainPage?.titleGeo || mainPage?.title || t("ourBigFamily")
        : mainPage?.title || mainPage?.titleGeo || t("ourBigFamily");

    const subtitle = isGeorgian
        ? mainPage?.subtitleGeo || mainPage?.subtitle || ""
        : mainPage?.subtitle || mainPage?.subtitleGeo || "";

    const backgroundUrl = mainPage?.backgroundUrl ?? null;
    const titleColor = mainPage?.titleColor ?? null;
    const subtitleColor = mainPage?.subtitleColor ?? null;

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
                boxSizing: "border-box",
                py: { xs: 8, sm: 10, md: 12 },
                backgroundColor: backgroundUrl ? "transparent" : "var(--color-white)",
            }}
        >
            <MainContentBackground backgroundUrl={backgroundUrl} />

            <MainContentClient
                title={title}
                subtitle={subtitle}
                titleColor={titleColor}
                subtitleColor={subtitleColor}
            />
        </Box>
    );
};

export default MainContent;
