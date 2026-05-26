"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button, Stack } from "@mui/material";
import { ArrowBackTwoTone, ArrowForwardTwoTone } from "@mui/icons-material";
import TutorDescriptionCard from "./TutorDescriptionCard";
import { StudentDTO } from "@/components/backend/types";

type Props = {
    students: StudentDTO[];
    isGeorgian: boolean;
};

const StudentCenterCarouselClient: React.FC<Props> = ({ students, isGeorgian }) => {
    const originalCount = students.length;
    const renderedStudents = React.useMemo(() => students, [students]);

    // center focus carousel with real slides only (no virtual duplicates)
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
        if (!emblaApi || originalCount === 0) return;

        emblaApi.scrollTo(0, true);
        onSelect();

        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect, originalCount]);

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const getStudentText = (s: StudentDTO) => {
        const name = isGeorgian ? s.firstNameGeo : s.firstName;
        const surname = isGeorgian ? s.lastNameGeo : s.lastName;
        const subject = isGeorgian ? s.certificationTypeGeo : s.certificationType;
        const description = isGeorgian ? s.aboutGeo : s.about;

        return { name, surname, subject, description };
    };

    return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
            {/* Embla viewport */}
            <Box
                ref={emblaRef}
                sx={{
                    overflow: "hidden",
                    // give a bit of height room to avoid layout jump
                    pb: 2,
                }}
            >
                {/* Embla container */}
                <Box
                    sx={{
                        display: "flex",
                        // IMPORTANT: allow side slides to peek
                        // Negative margin balances the side padding
                        ml: { xs: "-10px", sm: "-16px" },
                    }}
                >
                    {renderedStudents.map((s, i) => {
                        const { name, surname, subject, description } = getStudentText(s);

                        const d = Math.abs(i - selectedSnap);
                        const isActive = d === 0;
                        const isSide = d === 1;

                        // Style rules:
                        // - show 3 visually: center + 2 sides
                        // - hide everything except center + direct neighbors to avoid ghosting
                        // - blur + scale for non-active
                        const blur = isActive ? "none" : isSide ? "blur(2px)" : "none";
                        const opacity = isActive ? 1 : isSide ? 0.65 : 0;
                        const scale = isActive ? 1 : isSide ? 0.92 : 0.85;

                        return (
                            <Box
                                key={s.id}
                                sx={{
                                    // Slides sizing:
                                    // - On xs: show 1 center with slight peeks
                                    // - On sm+: show 3 (center + 2 sides)
                                    flex: "0 0 auto",
                                    width:
                                        originalCount === 1
                                            ? { xs: "84%", sm: "56%" }
                                            : originalCount === 2
                                                ? { xs: "84%", sm: "56%" }
                                                : { xs: "84%", sm: "33.3333%" },
                                    px: { xs: "10px", sm: "16px" },
                                    transition: "transform 300ms ease, opacity 300ms ease, filter 300ms ease",
                                    transform: `scale(${scale})`,
                                    opacity,
                                    filter: blur,
                                    // Ensure active slide is above the blurred ones a bit
                                    zIndex: isActive ? 2 : 1,
                                    pointerEvents: d <= 1 ? "auto" : "none",
                                }}
                            >
                                <Box
                                    sx={{
                                        mx: "auto",
                                        width:
                                            originalCount <= 2
                                                ? { xs: "100%", sm: "62%" }
                                                : "100%",
                                    }}
                                >
                                    <TutorDescriptionCard
                                        id={s.id}
                                        name={name}
                                        surname={surname}
                                        subjectName={subject}
                                        description={description}
                                        imagePath={s.coverUrl ?? "/src/assets/images/tutors/default.png"}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                    onClick={scrollPrev}
                    disabled={!canPrev}
                    sx={{ minWidth: 0, color: "var(--color-orange)", "&:hover": { backgroundColor: "transparent" } }}
                    aria-label="Previous"
                >
                    <ArrowBackTwoTone sx={{ border: "1px solid", borderRadius: "50%", fontSize: 24, p: 1.5 }} />
                </Button>

                <Button
                    onClick={scrollNext}
                    disabled={!canNext}
                    sx={{ minWidth: 0, color: "var(--color-orange)", "&:hover": { backgroundColor: "transparent" } }}
                    aria-label="Next"
                >
                    <ArrowForwardTwoTone sx={{ border: "1px solid", borderRadius: "50%", fontSize: 24, p: 1.5 }} />
                </Button>
            </Stack>
        </Box>
    );
};

export default StudentCenterCarouselClient;
