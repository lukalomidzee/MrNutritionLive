"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Button, IconButton, Link, Modal, Paper, Stack, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AuthorCard from "@/components/course-details/AuthorCard";
import StickyTriptychScroll, { Section } from "@/components/course-details/StickyTriptychScroll";
import { useAuthor, useCourse } from "@/components/backend/hooks";

export default function CourseDetailPageClient() {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const { data: course, loading, error } = useCourse(id);
    const authorId = course?.author?.id;
    const { data: author } = useAuthor(authorId);
    const authorData = author ?? course?.author ?? null;
    const [isHydrated, setIsHydrated] = useState(false);
    const [openPdf, setOpenPdf] = useState<string | null>(null);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const currencySymbols: Record<string, string> = {
        gel: "₾",
        usd: "$",
        eur: "EUR",
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Typography>{isHydrated ? `${t("loading")}...` : "Loading..."}</Typography>
            </Box>
        );
    }

    if (error || !course) {
        return (
            <Box textAlign="center" py={10}>
                <Typography color="red">
                    {error?.message ?? (isHydrated ? t("courseNotFound") : "THIS COURSE NOT FOUND")}
                </Typography>
            </Box>
        );
    }

    const isGeorgian = i18n.language === "ka";
    const displayCurrency = isGeorgian ? "GEL" : "USD";
    const displayPrice = isGeorgian ? course.priceGEL : course.priceUSD;
    const currencySymbol = currencySymbols[displayCurrency.toLowerCase()] ?? displayCurrency;
    const displayPriceLabel =
        displayPrice > 0 ? `${currencySymbol} ${displayPrice}` : t("free");
    const title = isGeorgian ? course.courseNameGeo : course.courseName;
    const description = isGeorgian ? course.descriptionGeo : course.description;
    const purchaseCta = isGeorgian ? "\u10e8\u10d4\u10e1\u10d0\u10eb\u10d4\u10dc\u10d0\u10d3 \u10db\u10dd\u10d2\u10d5\u10ec\u10d4\u10e0\u10d4\u10d7" : "Message us to purchase";
    const syllabusCta = isGeorgian ? "\u10e1\u10d8\u10da\u10d0\u10d1\u10e3\u10e1\u10d8" : "Syllabus";
    const syllabusPdfUrl = course.courseMaterials?.syllabusUrl ?? null;

    const scrollSections: Section[] = (course.courseMaterials?.sections ?? []).map((sec) => ({
        id: sec.id,
        title: isGeorgian ? sec.headingGeo : sec.heading,
        text: isGeorgian ? sec.paragraphGeo : sec.paragraph,
        image: sec.coverUrl ?? course.courseMaterials?.coverUrl ?? "/images/courses/course1.jpg",
    }));

    return (
        <>
            <Box
                component="section"
                sx={{
                    minHeight: "100dvh",
                    backgroundImage: course.courseMaterials?.backgroundUrl
                        ? `url(${course.courseMaterials.backgroundUrl})`
                        : "linear-gradient(135deg, #005841, #123257)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 2.5, md: 20 },
                    px: { xs: 2, md: 10 },
                    py: { xs: 6, md: 8 },
                }}
            >
                {course.courseMaterials?.coverUrl && (
                    <Box
                        component="img"
                        src={course.courseMaterials.coverUrl}
                        alt={title}
                        sx={{
                            marginLeft: { md: "200px" },
                            maxWidth: { xs: 280, md: 500 },
                            width: "100%",
                            borderRadius: 4,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                )}

                <Paper
                    elevation={6}
                    sx={{
                        maxWidth: 560,
                        width: "100%",
                        p: { xs: 2, md: 5 },
                        borderRadius: 4,
                        bgcolor: "rgba(246,245,227,0.95)",
                    }}
                >
                    <Stack spacing={3}>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            sx={{ color: "#005841", fontSize: { xs: "1.7rem", md: "3rem" }, lineHeight: { xs: 1.2, md: 1.167 } }}
                        >
                            {title}
                        </Typography>

                        <Typography variant="body1" sx={{ color: "#123257", fontSize: { xs: 14, md: 18 }, lineHeight: { xs: 1.5, md: 1.6 } }}>
                            {description}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: { xs: "flex-start", md: "center" },
                                justifyContent: "space-between",
                                flexDirection: { xs: "column", md: "row" },
                                gap: { xs: 1, md: 2 },
                            }}
                        >
                            <Typography variant="h4" fontWeight="bold" sx={{ color: "#FF914C", fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
                                {displayPriceLabel}
                            </Typography>
                            <Link
                                component="button"
                                type="button"
                                onClick={() => {
                                    if (syllabusPdfUrl) setOpenPdf(syllabusPdfUrl);
                                }}
                                sx={{
                                    color: syllabusPdfUrl ? "#005841" : "var(--color-gray)",
                                    fontWeight: 700,
                                    fontSize: { xs: 15, md: 18 },
                                    textDecoration: "none",
                                    borderBottom: `2px solid ${syllabusPdfUrl ? "#005841" : "var(--color-gray)"}`,
                                    cursor: syllabusPdfUrl ? "pointer" : "not-allowed",
                                    pointerEvents: syllabusPdfUrl ? "auto" : "none",
                                    "&:hover": syllabusPdfUrl ? { color: "#FF914C", borderBottomColor: "#FF914C" } : {},
                                }}
                            >
                                {syllabusCta}
                            </Link>
                        </Box>

                        <Button
                            component="a"
                            href="https://ig.me/m/m.rnutrition"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            size="large"
                            startIcon={<InstagramIcon />}
                            sx={{
                                backgroundColor: "#FF914C",
                                color: "#F6F5E3",
                                fontWeight: "bold",
                                fontSize: { xs: 14, md: 18 },
                                textTransform: "none",
                                borderRadius: 2,
                                width: { xs: "100%", md: "auto" },
                                px: { xs: 2, md: 4 },
                                py: { xs: 1.2, md: 1.5 },
                                "&:hover": { backgroundColor: "#E67F38" },
                            }}
                        >
                            {purchaseCta}
                        </Button>
                    </Stack>
                </Paper>
            </Box>

            {scrollSections.length > 0 && (
                <Box component="section">
                    <StickyTriptychScroll sections={scrollSections} />
                </Box>
            )}

            {authorData && <AuthorCard author={authorData} />}

            <Modal
                open={!!openPdf}
                onClose={(_, reason) => {
                    if (reason === "backdropClick" || reason === "escapeKeyDown") {
                        setOpenPdf(null);
                    }
                }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(6px)",
                    zIndex: 3000,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: { xs: "94vw", md: "min(900px, 82vw)" },
                        height: { xs: "86vh", md: "min(700px, 78vh)" },
                        bgcolor: "#0f0f0f",
                        borderRadius: 2,
                        boxShadow: "0 0 50px rgba(0,0,0,0.7)",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Box
                        sx={{
                            height: 46,
                            px: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            bgcolor: "rgba(0,0,0,0.25)",
                        }}
                    >
                        <IconButton
                            aria-label="Close PDF modal"
                            onClick={() => setOpenPdf(null)}
                            sx={{
                                color: "var(--color-white)",
                                bgcolor: "rgba(0,0,0,0.35)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                    <Box
                        component="iframe"
                        src={openPdf ?? ""}
                        title="Course Syllabus PDF"
                        sx={{
                            width: "100%",
                            height: "calc(100% - 46px)",
                            border: 0,
                            bgcolor: "#111",
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
}
