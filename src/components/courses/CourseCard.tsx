"use client";

import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { sitePath } from "@/lib/sitePath";

export type CourseCardProps = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    price: number;
    currency: string;
};

const currencySymbols: Record<string, string> = {
    GEL: "₾",
    USD: "$",
    EUR: "€",
};

type Props = {
    course: CourseCardProps;
    variant?: "paid" | "mini";
};

const CourseCard: React.FC<Props> = ({ course, variant = "paid" }) => {
    const { t } = useTranslation();
    const isMini = variant === "mini";
    const currencySymbol =
        currencySymbols[course.currency?.toUpperCase()] ?? course.currency;
    const priceLabel =
        course.price > 0 ? `${currencySymbol} ${course.price}` : t("free");
    const imageUrl = course.image || sitePath("/images/courses/course1.jpg");

    return (
        <Box
            className={`course-card ${variant}`}
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: isMini ? "100%" : { xs: 340, sm: 420, md: "100%" },
                mx: "auto",
                height: isMini
                    ? { xs: "360px", sm: "390px", md: "420px" }
                    : { xs: "430px", sm: "480px", md: "540px" },
                borderRadius: 0,
                overflow: "hidden",
                bgcolor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                "&:hover": { boxShadow: "0 12px 28px rgba(0,0,0,0.25)" },
            }}
        >
            {/* Cover image */}
            <Box
                sx={{
                    height: isMini ? "55%" : "65%",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "transform 0.5s ease",
                    ".course-card:hover &": {
                        transform: isMini ? "translateY(-15px)" : "translateY(-20px)",
                    },
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    boxSizing: "border-box",
                    height: isMini ? "45%" : "35%",
                    bgcolor: "#fff",
                    px: { xs: 2, sm: 2.5, md: 3 },
                    py: { xs: 1.5, sm: 1.8, md: 2 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    transition: "height 0.5s ease",
                    ".course-card:hover &": { height: "65%" },
                }}
            >
                <Box
                    sx={{
                        my: 2,
                        transition: "transform 0.5s ease",
                        ".course-card:hover &": { transform: "translateY(-10px)" },
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: isMini
                                ? { xs: 17, sm: 18, md: 20 }
                                : { xs: 19, sm: 22, md: 25 },
                            textAlign: "left",
                            color: "var(--color-green)",
                        }}
                    >
                        {course.title}
                    </Typography>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mt: isMini ? 3 : 5 }}
                    >
                        <Typography
                            sx={{
                                fontSize: isMini
                                    ? { xs: 15, sm: 16, md: 17 }
                                    : { xs: 16, sm: 18, md: 20 },
                                fontWeight: 700,
                                color: "var(--color-orange)",
                            }}
                        >
                            {priceLabel}
                        </Typography>
                    </Stack>
                </Box>

                {/* Hover details */}
                <Box
                    sx={{
                        mt: isMini ? 3 : 5,
                        opacity: 0,
                        transform: "translateY(40px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        ".course-card:hover &": { opacity: 1, transform: "translateY(0)" },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: isMini
                                ? { xs: 12, sm: 12.5, md: 13 }
                                : { xs: 13, sm: 14, md: 16 },
                            color: "var(--color-black)",
                            mb: 3,
                        }}
                    >
                        {course.description}
                    </Typography>

                    <Box
                        sx={{
                            mt: 1,
                        }}
                    >
                        <Button
                            component={Link}
                            href={`/courses/${course.id}`}
                            variant="contained"
                            disableElevation
                            sx={{
                                width: "80%",
                                mx: "auto",
                                display: "block",
                                textTransform: "none",
                                borderRadius: 0,
                                py: isMini ? 1.2 : 1.5,
                                fontSize: isMini
                                    ? { xs: 13, sm: 14, md: 15 }
                                    : { xs: 14, sm: 16, md: 18 },
                                bgcolor: "var(--color-green)",
                                color: "#fff !important",
                                transition: "background-color 0.3s ease, transform 0.2s ease",
                                "&:hover": {
                                    bgcolor: "var(--color-orange)",
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            Learn more
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
};

export default CourseCard;
