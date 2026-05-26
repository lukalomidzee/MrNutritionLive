"use client";

import { Typography } from "@mui/material";

type Props = {
    title: string;
    subtitle: string;
    titleColor: string | null;
    subtitleColor: string | null;
};

export default function HeroSectionClient({ title, subtitle, titleColor, subtitleColor }: Readonly<Props>) {
    return (
        <>
            <Typography
                variant="h1"
                fontWeight="bold"
                sx={{
                    color: titleColor || "var(--color-green)",
                    maxWidth: { xs: "100%", sm: "92%", md: "750px" },
                    fontFamily: "Noto Sans Georgian",
                    fontSize: { xs: "2rem", sm: "2.6rem", md: "3.6rem", lg: "4.8rem" },
                    lineHeight: { xs: 1.12, sm: 1.08, md: 1.05 },
                    zIndex: 1,
                }}
            >
                {title}
            </Typography>

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                    color: subtitleColor || "var(--color-orange)",
                    maxWidth: { xs: "100%", sm: "95%", md: "850px" },
                    fontFamily: "Noto Sans Georgian",
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.6rem", lg: "2rem" },
                    lineHeight: 1.25,
                    zIndex: 1,
                }}
            >
                {subtitle}
            </Typography>
        </>
    );
}
