"use client";

import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function FooterClient() {
    const { t } = useTranslation();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return (
        <Typography
            textAlign="center"
            variant="subtitle2"
            sx={{
                fontSize: { xs: "0.8rem", md: "1rem" },
                color: "var(--color-white)",
                transition: "all 0.3s ease",
                "&:hover": {
                    color: "var(--color-gray)",
                    cursor: "default",
                },
            }}
        >
            © {isHydrated ? t("allRightsReserved") : "All rights reserved"}
        </Typography>
    );
}