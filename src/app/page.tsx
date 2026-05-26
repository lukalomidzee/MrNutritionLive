import {Box} from "@mui/material";
import MainContent from "@/components/landing/main-content/MainContent";
import Courses from "@/components/landing/courses/Courses";
import Tutors from "@/components/landing/tutors/Tutors";
import AnimatedCursor from "@/components/cursor/AnimatedCursor";
import React from "react";
import YouTubeChannelsSection from "@/components/landing/youtube/YouTubeChannelsSection";
import SitePageVideoSection from "@/components/site-details/SitePageVideoSection";

export default function HomePage() {
    return (
        <>
            <AnimatedCursor />
            <Box
                overflow="hidden"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    "&::-webkit-scrollbar": {display: "none"},
                    scrollbarWidth: "none",
                    backgroundColor: "var(--color-white)",
                }}
            >
                <Box>
                    <MainContent/>
                </Box>
                <SitePageVideoSection pageTypeName="main" />
                <Box>
                    <Tutors/>
                </Box>
                <Box>
                    <Courses/>
                </Box>
                <Box>
                    <YouTubeChannelsSection />
                </Box>
            </Box>
        </>
    );
}
