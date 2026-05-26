"use client";

import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function StickyTabsClientLabel() {
    const { t } = useTranslation();

    return (
        <>
            <Typography fontWeight="bold" variant="h6" sx={{ fontFamily: "Noto Sans Georgian" }}>
                {t("courses")}
            </Typography>
        </>
    );
}
