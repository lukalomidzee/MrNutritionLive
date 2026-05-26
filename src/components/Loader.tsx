"use client";

import { Box } from "@mui/material";

export default function Loader() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "var(--color-white)",
            }}
        >
            <div className="loader" />
        </Box>
    );
}
