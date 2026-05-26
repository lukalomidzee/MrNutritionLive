"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowBackTwoTone, ArrowForwardTwoTone } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CourseListDTO } from "@/components/backend/types";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/components/backend/hooks";
import FadeIn from "@/lib/motion/FadeIn";

const CoursesListClient: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { items, loading, error } = useCourses();

    const sortedItems: CourseListDTO[] = React.useMemo(() => {
        const list = [...(items ?? [])];
        list.sort((a, b) => {
            const dateA = new Date(a.createdAt ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? 0).getTime();
            return dateB - dateA;
        });
        return list;
    }, [items]);

    const paidItems = React.useMemo(
        () => sortedItems.filter((c) => c.courseType?.toLowerCase() === "paid"),
        [sortedItems]
    );
    const miniItems = React.useMemo(
        () => sortedItems.filter((c) => c.courseType?.toLowerCase() === "mini"),
        [sortedItems]
    );

    const isGeorgian = i18n.language === "ka";
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const [activeType, setActiveType] = React.useState<"paid" | "mini">(
        paidItems.length > 0 ? "paid" : "mini"
    );

    React.useEffect(() => {
        if (activeType === "paid" && paidItems.length === 0 && miniItems.length > 0) {
            setActiveType("mini");
            return;
        }
        if (activeType === "mini" && miniItems.length === 0 && paidItems.length > 0) {
            setActiveType("paid");
        }
    }, [activeType, paidItems.length, miniItems.length]);

    const activeItems = activeType === "paid" ? paidItems : miniItems;
    const hasPaid = paidItems.length > 0;
    const hasMini = miniItems.length > 0;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "center",
        skipSnaps: false,
        containScroll: false,
    });
    const [selectedSnap, setSelectedSnap] = React.useState(0);
    const [canPrev, setCanPrev] = React.useState(false);
    const [canNext, setCanNext] = React.useState(false);

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedSnap(emblaApi.selectedScrollSnap());
        setCanPrev(emblaApi.canScrollPrev());
        setCanNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        emblaApi.reInit();
        emblaApi.scrollTo(0, true);
        onSelect();
    }, [emblaApi, activeType, onSelect, activeItems.length]);

    React.useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const renderCourseCard = (course: CourseListDTO, variant: "paid" | "mini", index: number) => {
        const title = isGeorgian ? course.courseNameGeo : course.courseName;
        const description = isGeorgian
            ? course.shortDescriptionGeo
            : course.shortDescription;
        const price = isGeorgian ? course.priceGEL : course.priceUSD;
        const currency = isGeorgian ? "GEL" : "USD";
        const d = Math.abs(index - selectedSnap);
        const isActive = d === 0;
        const isSide = d === 1;

        return (
            <Box
                key={`${variant}-${course.id}`}
                sx={{
                    flex: "0 0 auto",
                    width: isDesktop
                        ? (variant === "paid" ? 600 : 380)
                        : { xs: "84%", sm: "56%" },
                    maxWidth: isDesktop ? "none" : undefined,
                    minWidth: isDesktop
                        ? (variant === "paid" ? 600 : 380)
                        : undefined,
                    px: { xs: "10px", sm: "16px" },
                    transition: "transform 300ms ease, opacity 300ms ease, filter 300ms ease",
                    transform: {
                        xs: `scale(${isActive ? 1 : isSide ? 0.94 : 0.9})`,
                        md: "none",
                    },
                    opacity: {
                        xs: isActive ? 1 : isSide ? 0.7 : 0,
                        md: 1,
                    },
                    filter: {
                        xs: isActive ? "none" : isSide ? "blur(2px)" : "none",
                        md: "none",
                    },
                    zIndex: { xs: isActive ? 2 : 1, md: 1 },
                    pointerEvents: { xs: d <= 1 ? "auto" : "none", md: "auto" },
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
                    variant={variant}
                />
            </Box>
        );
    };

    return (
        <Box
            sx={{
                minHeight: "600px",
                scrollSnapAlign: "start",
                px: 2,
                py: 6,
                maxWidth: "1400px",
                mx: "auto",
            }}
        >
            {loading && <Box textAlign="center">{t("loading")}...</Box>}
            {error && <Box textAlign="center" color="red">{error.message}</Box>}

            {!loading && !error && (
                hasPaid || hasMini ? (
                    <FadeIn>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ flexWrap: "wrap" }}>
                                {hasPaid && (
                                    <Button
                                        onClick={() => setActiveType("paid")}
                                        variant={activeType === "paid" ? "contained" : "outlined"}
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 6,
                                            px: 2.5,
                                            py: 0.9,
                                            bgcolor: activeType === "paid" ? "var(--color-green)" : "transparent",
                                            borderColor: "var(--color-green)",
                                            color: activeType === "paid" ? "#fff" : "var(--color-green)",
                                            "&:hover": {
                                                bgcolor: activeType === "paid" ? "var(--color-green)" : "rgba(18,129,47,0.08)",
                                                borderColor: "var(--color-green)",
                                            },
                                        }}
                                    >
                                        {t("paidCourses")}
                                    </Button>
                                )}
                                {hasMini && (
                                    <Button
                                        onClick={() => setActiveType("mini")}
                                        variant={activeType === "mini" ? "contained" : "outlined"}
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 6,
                                            px: 2.5,
                                            py: 0.9,
                                            bgcolor: activeType === "mini" ? "var(--color-orange)" : "transparent",
                                            borderColor: "var(--color-orange)",
                                            color: activeType === "mini" ? "#fff" : "var(--color-orange)",
                                            "&:hover": {
                                                bgcolor: activeType === "mini" ? "var(--color-orange)" : "rgba(240,132,65,0.1)",
                                                borderColor: "var(--color-orange)",
                                            },
                                        }}
                                    >
                                        {t("miniCourses")}
                                    </Button>
                                )}
                            </Stack>

                            {isDesktop ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    {activeItems.map((course, index) => renderCourseCard(course, activeType, index))}
                                </Box>
                            ) : (
                                <>
                                    <Box
                                        ref={emblaRef}
                                        sx={{
                                            overflow: "hidden",
                                            pb: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                ml: { xs: "-10px", sm: "-16px" },
                                            }}
                                        >
                                            {activeItems.map((course, index) => renderCourseCard(course, activeType, index))}
                                        </Box>
                                    </Box>

                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        <Button
                                            onClick={scrollPrev}
                                            disabled={!canPrev}
                                            sx={{ minWidth: 0, color: "var(--color-green)", "&:hover": { backgroundColor: "transparent" } }}
                                            aria-label="Previous"
                                        >
                                            <ArrowBackTwoTone sx={{ border: "1px solid", borderRadius: "50%", fontSize: 24, p: 1.5 }} />
                                        </Button>

                                        <Button
                                            onClick={scrollNext}
                                            disabled={!canNext}
                                            sx={{ minWidth: 0, color: "var(--color-green)", "&:hover": { backgroundColor: "transparent" } }}
                                            aria-label="Next"
                                        >
                                            <ArrowForwardTwoTone sx={{ border: "1px solid", borderRadius: "50%", fontSize: 24, p: 1.5 }} />
                                        </Button>
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </FadeIn>
                ) : (
                    <Box
                        px={2}
                        py={6}
                        textAlign="center"
                        fontSize="20px"
                        fontWeight="500"
                        color="var(--color-gray)"
                    >
                        {t("coursesComingSoon")}
                    </Box>
                )
            )}
        </Box>
    );
};

export default CoursesListClient;
