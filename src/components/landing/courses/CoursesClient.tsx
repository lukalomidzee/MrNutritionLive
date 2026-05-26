"use client";

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import CoursesListClient from "./CoursesListClient";

const CoursesClient: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* Title Row */}
            <Box
                id="Courses-Title"
                sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
                <Typography
                    sx={{
                        fontSize: "32px",
                        fontFamily: "Noto Sans Georgian",
                        fontWeight: "bold",
                        mb: 4,
                        m: 3,
                    }}
                >
                    {t("ourCourses")}
                </Typography>

                <Divider
                    sx={{
                        width: 100,
                        height: 2,
                        backgroundColor: "var(--color-green)",
                        borderRadius: 2,
                        mx: 3,
                    }}
                />
            </Box>

            <CoursesListClient />
        </>
    );
};

export default CoursesClient;
