"use client";

import { Stack, Typography } from "@mui/material";

export default function Fact({
                                 label,
                                 value,
                                 link,
                             }: Readonly<{ label: string; value?: string | null; link?: string }>) {
    if (!value) return null;
    return (
        <Stack spacing={0.5}>
            <Typography
                variant="subtitle2"
                sx={{
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    fontSize: 13,
                    letterSpacing: 0.5,
                }}
            >
                {label}
            </Typography>

            {link ? (
                <Typography
                    component="a"
                    href={link}
                    sx={{
                        color: "rgba(255,255,255,0.85)",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    {value}
                </Typography>
            ) : (
                <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                    {value}
                </Typography>
            )}
        </Stack>
    );
}
