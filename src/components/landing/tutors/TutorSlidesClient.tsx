"use client";

import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useStudents } from "@/components/backend/hooks";
import StudentCenterCarouselClient from "@/components/landing/tutors/StudentCenterCarouselClient";

const TutorSlidesClient: React.FC = () => {
    const { items: students, loading, error } = useStudents();
    const { t, i18n } = useTranslation();
    const isGeorgian = i18n.language === "ka";
    const featuredStudents = React.useMemo(
        () =>
            (students ?? [])
                .filter((student) => student.featured)
                .slice()
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ),
        [students]
    );

    if (loading) return <Box textAlign="center">Loading...</Box>;
    if (error) return <Box textAlign="center" color="red">{error.message}</Box>;
    if (!featuredStudents.length) return <Box px={2} py={6} textAlign="center" fontSize="20px" fontWeight="500" color="var(--color-gray)">{t("noStudentsFound")}</Box>;

    return (
        <Box component="section" sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
            {/* All breakpoints: centered + blurred carousel */}
            <StudentCenterCarouselClient students={featuredStudents} isGeorgian={isGeorgian} />
        </Box>
    );
};

export default TutorSlidesClient;
