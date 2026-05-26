import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import FooterClient from "./FooterClient";

export default function Footer() {
    return (
        <Stack
            component="footer"
            direction={{ xs: "column", sm: "row", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            bgcolor="var(--color-black)"
            spacing={{ xs: 2 }}
            sx={{
                minHeight: { xs: "80px", md: "120px" },
                height: "auto",
                padding: {
                    xs: "1rem",
                    sm: "1.5rem 2rem",
                    md: "2rem 2rem",
                },
                gap: { xs: 1, md: 0 },
            }}
        >
            <Image
                src="/images/logos/logo_white.png"
                alt="Mr. Nutrition Logo"
                width={200}
                height={80}
                style={{ height: "auto", width: "auto" }}
            />

            <Stack
                direction="column"
                alignItems={{ xs: "center", sm: "flex-end" }}
                color="var(--color-white)"
                spacing={{ xs: 1, md: 0 }}
            >
                <Typography
                    textAlign="center"
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
                    Mr. Nutrition Academy Of Georgia
                </Typography>

                <FooterClient />
            </Stack>
        </Stack>
    );
}
