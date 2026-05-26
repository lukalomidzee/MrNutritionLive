"use client";

import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/components/backend/hooks";
import type { CourseListDTO } from "@/components/backend/types";

export default function PaidCoursesClient() {
    const { t, i18n } = useTranslation();
    const { items, loading, error } = useCourses();

    const paidItems: CourseListDTO[] = (items ?? []).filter(
        (c) => c.courseType?.toLowerCase() === "paid"
    );

    return (
        <>
            <Typography
                sx={{
                    fontSize: { xs: "2.2rem", sm: "3rem", md: "4.2rem", lg: "5.6rem" },
                    fontFamily: "Noto Sans Georgian",
                    fontWeight: "bold",
                    mb: { xs: 3, sm: 4, md: 6 },
                    lineHeight: 1.1,
                    color: "var(--color-blue)",
                    whiteSpace: "pre-line",
                }}
            >
                {t("paidCourses").split(" ").join("\n")}
            </Typography>

            {loading && <Box px={4} pb={4}>Loading courses…</Box>}
            {error && <Box px={4} pb={4} color="red">{error.message}</Box>}

            {!loading && !error && (
                paidItems.length > 0 ? (
                    <Box
                        sx={{
                            px: { xs: 0.5, sm: 1, md: 4, lg: 10 },
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            },
                            justifyItems: "center",
                            gap: { xs: 3, sm: 4, md: 6 },
                        }}
                    >
                        {paidItems.map((course) => {
                            const isGeorgian = i18n.language === "ka";
                            const title = isGeorgian ? course.courseNameGeo : course.courseName;
                            const description = isGeorgian
                                ? course.shortDescriptionGeo
                                : course.shortDescription;
                            const price = isGeorgian ? course.priceGEL : course.priceUSD;
                            const currency = isGeorgian ? "GEL" : "USD";

                            return (
                                <Box
                                    key={course.id}
                                    sx={{
                                        width: "100%",
                                        maxWidth: { xs: 340, sm: 420, md: "100%" },
                                        transition: "all 0.35s ease",
                                        "&:hover": { transform: "translateY(-5px) scale(1.02)", zIndex: 3 },
                                    }}
                                >
                                    <CourseCard
                                        course={{
                                            id: course.id,
                                            title,
                                            description,
                                            price,
                                            currency,
                                            image: course.coverUrl,
                                        }}
                                        variant="paid"
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Box px={2} py={6} textAlign="center" fontSize="20px" fontWeight="500" color="var(--color-gray)">
                        {t("coursesComingSoon")}
                    </Box>
                )
            )}
        </>
    );
}
