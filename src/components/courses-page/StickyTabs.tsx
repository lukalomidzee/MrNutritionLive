"use client";

import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
    isSticky: boolean;
    onCoursesClick: () => void;
    onPaidClick: () => void;
    onMiniClick: () => void;
};

export default function StickyTabs({ isSticky, onCoursesClick, onPaidClick, onMiniClick }: Props) {
    const { t } = useTranslation();

    return (
        <Box sx={{ height: { xs: "56px", sm: "60px", md: "64px" } }}>
            <Box
                sx={{
                    position: isSticky ? "fixed" : "relative",
                    top: isSticky ? 0 : "auto",
                    zIndex: 999,
                    width: "100%",
                    backgroundColor: "var(--color-green)",
                    boxShadow: isSticky ? 2 : 0,
                    px: { xs: 1, sm: 1.5, md: 2 },
                    py: { xs: 1, sm: 1.2, md: 2 },
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <Stack
                    direction="row"
                    spacing={{ xs: 1.5, sm: 2, md: 3 }}
                    alignItems="center"
                    maxWidth="1600px"
                    mx="auto"
                    color="var(--color-white)"
                    sx={{
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none",
                    }}
                >
                    <Button
                        onClick={onCoursesClick}
                        sx={{
                            color: "var(--color-white)",
                            fontFamily: "Noto Sans Georgian",
                            fontWeight: "bold",
                            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.25rem" },
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            p: 0,
                            minWidth: "auto",
                        }}
                    >
                        {t("courses")}
                    </Button>

                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: "var(--color-orange)" }} />

                    <Button
                        onClick={onPaidClick}
                        sx={{
                            color: "var(--color-white)",
                            fontFamily: "Noto Sans Georgian",
                            fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            minWidth: "auto",
                            p: 0,
                        }}
                    >
                        {t("paidCourses")}
                    </Button>

                    <Button
                        onClick={onMiniClick}
                        sx={{
                            color: "var(--color-white)",
                            fontFamily: "Noto Sans Georgian",
                            fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            minWidth: "auto",
                            p: 0,
                        }}
                    >
                        {t("miniCourses")}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
