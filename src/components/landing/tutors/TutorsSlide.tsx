"use client";

import React from "react";
import {Box, Button, Stack, useMediaQuery, useTheme} from "@mui/material";
import {ArrowBackTwoTone, ArrowForwardTwoTone} from "@mui/icons-material";
import TutorDescriptionCard from "./TutorDescriptionCard";
import { useTranslation } from "react-i18next";
import {StudentDTO} from "@/components/backend/types";
import {useStudents} from "@/components/backend/hooks";

function TutorGrid({ students, isGeorgian }: Readonly<{ students: StudentDTO[]; isGeorgian: boolean }>) {
    return (
        <Box
            component="section"
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 3,
                maxWidth: "1200px",
                mx: "auto",
                px: 2,
                py: 4,
            }}
        >
            {students.map((s) => {
                const name = isGeorgian ? s.firstNameGeo : s.firstName;
                const surname = isGeorgian ? s.lastNameGeo : s.lastName;
                const subject = isGeorgian ? s.certificationTypeGeo : s.certificationType;
                const description = isGeorgian ? s.aboutGeo : s.about;

                return (
                    <TutorDescriptionCard
                        key={s.id}
                        id={s.id}
                        name={name}
                        surname={surname}
                        subjectName={subject}
                        description={description}
                        imagePath={s.coverUrl ?? "/src/assets/images/tutors/default.png"}
                    />

                );
            })}
        </Box>
    );
}

function TutorSlider({
                         students,
                         cardsPerView,
                         isGeorgian,
                     }: Readonly<{
    students: StudentDTO[];
    cardsPerView: number;
    isGeorgian: boolean;
}>) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = React.useState(0);

    React.useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [cardsPerView]);

    const gap = 15;
    const cardWidth =
        containerWidth > 0
            ? (containerWidth - gap * (cardsPerView - 1)) / cardsPerView
            : 0;
    const maxIndex = students.length - cardsPerView;

    return (
        <Box component="section" sx={{ px: 2, py: 4 }}>
            <Box ref={containerRef} sx={{ overflow: "hidden", mx: "auto", mb: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: `${gap}px`,
                        transform: `translateX(-${activeIndex * (cardWidth + gap)}px)`,
                        transition: "transform 0.5s ease",
                    }}
                >
                    {students.map((s) => {
                        const key=s.id;
                        const name = isGeorgian ? s.firstNameGeo : s.firstName;
                        const surname = isGeorgian ? s.lastNameGeo : s.lastName;
                        const subject = isGeorgian ? s.certificationTypeGeo : s.certificationType;
                        const description = isGeorgian ? s.aboutGeo : s.about;

                        return (
                            <Box key={s.id} sx={{ flex: `0 0 ${cardWidth}px` }}>
                                <TutorDescriptionCard
                                    id={s.id} // ✅ use id instead of key
                                    name={name}
                                    surname={surname}
                                    subjectName={subject}
                                    description={description}
                                    imagePath={s.coverUrl ?? "/src/assets/images/tutors/default.png"}
                                />
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                    onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
                    disabled={activeIndex === 0}
                    sx={{
                        minWidth: 0,
                        color: activeIndex === 0 ? "grey.500" : "var(--color-orange)",
                        "&:hover": { backgroundColor: "transparent" },
                    }}
                >
                    <ArrowBackTwoTone
                        sx={{ border: "1px solid", borderRadius: "50%", fontSize: 24, p: 1.5 }}
                    />
                </Button>
                <Button
                    onClick={() => setActiveIndex((i) => Math.min(i + 1, maxIndex))}
                    disabled={activeIndex === maxIndex}
                    sx={{
                        minWidth: 0,
                        color: activeIndex === maxIndex ? "grey.500" : "var(--color-orange)",
                        "&:hover": { backgroundColor: "transparent" },
                    }}
                >
                    <ArrowForwardTwoTone
                        sx={{ border: "1px solid", borderRadius: "50%", fontSize: 24, p: 1.5 }}
                    />
                </Button>
            </Stack>
        </Box>
    );
}

const TutorSlides: React.FC = () => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.only("sm"));
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const { items: students, loading, error } = useStudents();
    const { i18n } = useTranslation();
    const isGeorgian = i18n.language === "ka";

    if (loading) return <Box textAlign="center">Loading...</Box>;
    if (error) return <Box textAlign="center" color="red">{error.message}</Box>;
    if (!students || students.length === 0) return <Box textAlign="center">No students yet.</Box>;

    if (isMdUp) {
        return <TutorGrid students={students} isGeorgian={isGeorgian} />;
    }

    const cardsPerView = isSm ? 2 : 1;
    return <TutorSlider students={students} cardsPerView={cardsPerView} isGeorgian={isGeorgian} />;
};

export default TutorSlides;
