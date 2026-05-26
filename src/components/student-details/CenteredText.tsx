"use client";

import { Box, Typography } from "@mui/material";

export default function CenteredText({
                                         text,
                                         height = "100vh",
                                     }: Readonly<{ text: string; height?: string }>) {
    return (
        <Box
            sx={{
                width: "100vw",
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "black",
                color: "white",
                textAlign: "center",
                p: 2,
            }}
        >
            <Typography
                variant="h5"
                sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}
            >
                {text}
            </Typography>
        </Box>
    );
}
