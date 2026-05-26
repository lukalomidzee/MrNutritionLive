"use client";

import { Card, CardMedia, CardContent, Typography, Box, Chip } from "@mui/material";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StudentDTO } from "@/components/backend/types";
import { useRouter } from "next/navigation";
import { sitePath } from "@/lib/sitePath";

export default function StudentCard({ student }: Readonly<{ student: StudentDTO }>) {
    const { i18n } = useTranslation();
    const isGeorgian = i18n.language === "ka";
    const router = useRouter();

    const firstName = isGeorgian ? student.firstNameGeo : student.firstName;
    const lastName = isGeorgian ? student.lastNameGeo : student.lastName;
    const about = isGeorgian ? student.aboutGeo : student.about;
    const recommendedLabel = "Recommended";
    const imageUrl = student.coverUrl || sitePath("/images/backgrounds/students-together.jpeg");

    return (
        <Card
            onClick={() => router.push(`/students/${student.id}`)}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 14px 30px rgba(0,0,0,0.12)" },
            }}
        >
            {student.academyFavourite && (
                <Chip
                    icon={<Star size={12} />}
                    label={recommendedLabel}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        bgcolor: "#1976d2",
                        color: "white",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        height: 24,
                        "& .MuiChip-icon": { color: "white", ml: 0.5 },
                    }}
                />
            )}
            <CardMedia
                component="img"
                height="240"
                image={imageUrl}
                alt={`${firstName} ${lastName}`}
                sx={{
                    objectFit: "cover",
                    objectPosition: "center top",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                }}
            />

            <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {firstName} {lastName}
                </Typography>
                <Box sx={{ display: "flex", gap: 1.2, mt: 2.5 }}>
                    <Quote size={20} style={{ color: "var(--color-green)", flexShrink: 0, marginTop: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", lineHeight: 1.7 }}>
                        &ldquo;{about}&rdquo;
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
