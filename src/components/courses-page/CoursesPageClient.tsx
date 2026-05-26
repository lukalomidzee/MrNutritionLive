"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import HeroSection from "@/components/courses-page/HeroSection";
import StickyTabs from "@/components/courses-page/StickyTabs";
import PaidCourses from "@/components/courses-page/PaidCourses";
import MiniCourses from "@/components/courses-page/MiniCourses";
import SitePageVideoSection from "@/components/site-details/SitePageVideoSection";

export default function CoursesPageClient() {
    const paidRef = useRef<HTMLDivElement>(null);
    const miniRef = useRef<HTMLDivElement>(null);
    const stickyTriggerRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    const [isSticky, setIsSticky] = useState(false);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop - 80,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const currentScrollY = window.scrollY;

                if (!entry.isIntersecting && currentScrollY > lastScrollY.current) {
                    setIsSticky(true);
                } else if (entry.isIntersecting && currentScrollY < lastScrollY.current) {
                    setIsSticky(false);
                }

                lastScrollY.current = currentScrollY;
            },
            { threshold: 0 }
        );

        if (stickyTriggerRef.current) observer.observe(stickyTriggerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <HeroSection />
            <SitePageVideoSection pageTypeName="courses" />

            <div ref={stickyTriggerRef} />
            <StickyTabs
                isSticky={isSticky}
                onCoursesClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                onPaidClick={() => scrollToSection(paidRef)}
                onMiniClick={() => scrollToSection(miniRef)}
            />

            <Box
                sx={{
                    px: { xs: 1.5, sm: 2, md: 6, lg: 12, xl: 20 },
                    py: { xs: 3, sm: 4, md: 6 },
                    mx: "auto",
                    backgroundColor: "var(--color-white)",
                }}
            >
                <Box ref={paidRef}>
                    <PaidCourses />
                </Box>

                <Box mt={{ xs: 5, sm: 6, md: 8 }} ref={miniRef}>
                    <MiniCourses />
                </Box>
            </Box>
        </>
    );
}
