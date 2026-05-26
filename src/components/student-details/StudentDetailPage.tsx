"use client";

import React, {useRef, useState} from "react";
import {Box, IconButton, useMediaQuery, useTheme} from "@mui/material";
import {ArrowBackIos, ArrowForwardIos} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";
import {Swiper, SwiperSlide} from "swiper/react";
import {Mousewheel, Navigation} from "swiper/modules";
import {animate, AnimatePresence, motion, useMotionValue} from "framer-motion";
import gsap from "gsap";
import {useStudent} from "@/components/backend/hooks";

import "swiper/css";
import "swiper/css/navigation";

import CenteredText from "./CenteredText";
import StudentDetailsSection from "./StudentDetailsSection";
import StudentFastInfoAndCertificates from "./StudentFastInfoAndCertificates";
import StudentHeroSection from "@/components/student-details/StudentHeroSection";
import StudentTransitionSlide from "@/components/student-details/StudentTransitionSlide";
import VideoPortfolio from "./VideoPortfolio";

gsap.registerPlugin();
export default function StudentDetailPage({id}: Readonly<{ id: string }>) {
    const router = useRouter();
    const {t, i18n} = useTranslation();
    const {data: student, loading, error} = useStudent(id);
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = useRef<any>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const thumbX = useMotionValue(0);
    const totalSlides = 5;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const updateThumbPosition = (index: number) => {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!track || !thumb) return;
        const trackWidth = track.clientWidth;
        const thumbWidth = thumb.clientWidth;
        const maxThumbX = trackWidth - thumbWidth;
        const targetX = (index / (totalSlides - 1)) * maxThumbX;
        animate(thumbX, targetX, {duration: 0.8, ease: "easeInOut"});
    };

    if (loading) return <CenteredText text={t("loading")} height="100vh"/>;
    if (error || !student)
        return <CenteredText text={t("studentNotFound")} height="100vh"/>;

    const isGeorgian = i18n.language === "ka";
    const getLang = (geo: string, eng: string) => (isGeorgian ? geo : eng);
    const studentVideos = student.media.filter(
        (item) => item.mediaRoleTypeName?.toLowerCase() === "studentvideo"
    );

    return (
        <Box
            sx={{
                position: "relative",
                height: "100vh",
                width: "100vw",
                backgroundColor: "#0b0b0b",
                color: "#fff",
                fontFamily: "Noto Sans Georgian, sans-serif",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: {xs: 84, md: 150},
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    px: {xs: 2, md: 6},
                    background: "transparent",
                    zIndex: 2000,
                }}
            >
                <Box sx={{display: "flex", alignItems: "center", gap: {xs: 2, md: 8}}}>
                    <Box
                        component="img"
                        src="/images/logos/logo_orange.png"
                        alt="Nutrition Academy Logo"
                        sx={{
                            height: {xs: 72, md: 150},
                            cursor: "pointer",
                            "&:hover": {opacity: 0.85},
                        }}
                        onClick={() => router.push("/")}
                    />

                    <Box sx={{display: "flex", alignItems: "center", gap: {xs: 1.5, md: 5}}}>
                        {["home", "courses", "students"].map((key, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    fontSize: {xs: 10, md: 15},
                                    fontWeight: 500,
                                    color: "#ffeb70",
                                    textTransform: "uppercase",
                                    letterSpacing: {xs: 0.5, md: 1},
                                    cursor: "pointer",
                                    transition: "opacity 0.3s, transform 0.2s",
                                    "&:hover": {opacity: 0.6, transform: "translateY(-2px)"},
                                }}
                                onClick={() =>
                                    router.push(
                                        key === "home"
                                            ? "/"
                                            : key === "courses"
                                                ? "/courses"
                                                : "/students"
                                    )
                                }
                            >
                                {t(key)}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* === Navigation Arrows === */}
            <IconButton
                onClick={() => {
                    if (swiperRef.current) {
                        swiperRef.current.slidePrev();
                        updateThumbPosition(swiperRef.current.activeIndex);
                        setCurrentIndex(swiperRef.current.activeIndex);
                    }
                }}
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: {xs: 8, md: 16},
                    transform: "translateY(-50%)",
                    zIndex: 1000,
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    width: {xs: 38, md: 48},
                    height: {xs: 38, md: 48},
                    "&:hover": {background: "rgba(255,255,255,0.15)"},
                }}
            >
                <ArrowBackIos sx={{fontSize: {xs: 16, md: 22}}}/>
            </IconButton>

            <IconButton
                onClick={() => {
                    if (swiperRef.current) {
                        swiperRef.current.slideNext();
                        updateThumbPosition(swiperRef.current.activeIndex);
                        setCurrentIndex(swiperRef.current.activeIndex);
                    }
                }}
                sx={{
                    position: "fixed",
                    top: "50%",
                    right: {xs: 8, md: 16},
                    transform: "translateY(-50%)",
                    zIndex: 1000,
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    width: {xs: 38, md: 48},
                    height: {xs: 38, md: 48},
                    "&:hover": {background: "rgba(255,255,255,0.15)"},
                }}
            >
                <ArrowForwardIos sx={{fontSize: {xs: 16, md: 22}}}/>
            </IconButton>

            {/* 🔥 Static background visible on slides 2, 3, and 4 */}
            <AnimatePresence>
                {currentIndex === 3 && (
                    <motion.div
                        key="transition-bg"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.8, ease: "easeInOut"}}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundImage: "url(/images/courses/course1.jpg)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundAttachment: "fixed",
                            zIndex: 0,
                        }}
                    />
                )}
            </AnimatePresence>


            {/* === Slides move over static background === */}
            {/* === Slides move over static background === */}
            <Swiper
                modules={[Mousewheel, Navigation]}
                direction="horizontal"
                slidesPerView={1}
                mousewheel
                speed={1200}
                navigation={false}
                centeredSlides={false}
                spaceBetween={0}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => {
                    setCurrentIndex(swiper.activeIndex);
                    updateThumbPosition(swiper.activeIndex);
                }}
                style={{
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden",
                    zIndex: 2,
                    background: "transparent",
                }}
            >
                <SwiperSlide style={{width: "100vw"}}>
                    <StudentHeroSection student={student} getLang={getLang}/>
                </SwiperSlide>

                <SwiperSlide style={{width: "100vw"}}>
                    <StudentDetailsSection student={student} getLang={getLang}/>
                </SwiperSlide>


                <SwiperSlide style={{width: "100vw"}}>
                    <StudentFastInfoAndCertificates student={student} getLang={getLang}/>
                </SwiperSlide>

                <SwiperSlide style={{width: "100vw"}}>
                    <StudentTransitionSlide student={student}/>
                </SwiperSlide>

                <SwiperSlide style={{width: "100vw"}}>
                    <VideoPortfolio videos={studentVideos}/>
                </SwiperSlide>
            </Swiper>

            <Box
                ref={trackRef}
                sx={{
                    position: "fixed",
                    bottom: {xs: 14, md: 32},
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: {xs: "min(250px, 72vw)", md: "min(500px, 70vw)"},
                    height: {xs: "4px", md: "5px"},
                    backgroundColor: "rgba(255,255,255,0.07)",
                    borderRadius: "4px",
                    overflow: "visible",
                    zIndex: 1200,
                }}
            >
                <motion.div
                    ref={thumbRef}
                    style={{
                        x: thumbX,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: isMobile ? "42px" : "70px",
                        height: isMobile ? "6px" : "8px",
                        borderRadius: "4px",
                        background: "#ffeb70",
                    }}
                >
                </motion.div>
            </Box>
        </Box>
    );
}
