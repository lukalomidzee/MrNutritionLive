"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { CourseMediaDTO } from "@/components/backend/types";
import "swiper/css";
import "swiper/css/navigation";

type VideoPortfolioProps = {
    videos: CourseMediaDTO[];
};

type PortfolioVideo = {
    id: string;
    embedUrl: string;
    publicUrl: string;
    platform: string;
};

type VideoMetadata = {
    title: string | null;
    authorName: string | null;
    authorUrl: string | null;
    providerName: string | null;
    thumbnailUrl: string | null;
};

function extractYouTubeVideoId(url: string): string | null {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        if (host.includes("youtu.be")) {
            return parsed.pathname.replace(/^\/+/, "") || null;
        }

        if (!host.includes("youtube.com")) {
            return null;
        }

        if (parsed.pathname === "/watch") {
            return parsed.searchParams.get("v");
        }

        const segments = parsed.pathname.split("/").filter(Boolean);
        if (segments.length >= 2 && ["embed", "shorts", "live"].includes(segments[0])) {
            return segments[1];
        }

        return null;
    } catch {
        return null;
    }
}

function toPortfolioVideo(video: CourseMediaDTO, index: number): PortfolioVideo | null {
    const publicUrl = video.publicUrl?.trim();
    if (!publicUrl) {
        return null;
    }

    const youtubeVideoId = extractYouTubeVideoId(publicUrl);
    if (!youtubeVideoId) {
        return null;
    }

    return {
        id: video.mediaAssetId || `${youtubeVideoId}-${index}`,
        embedUrl: `https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&version=3`,
        publicUrl,
        platform: "YouTube",
    };
}

export default function VideoPortfolio({ videos }: Readonly<VideoPortfolioProps>) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const iframesRef = useRef<(HTMLIFrameElement | null)[]>([]);
    const [swiperInstance, setSwiperInstance] = useState<any>(null);
    const [videoMetadata, setVideoMetadata] = useState<Record<string, VideoMetadata>>({});
    const portfolioVideos = useMemo(
        () =>
            videos
                .map((video, index) => toPortfolioVideo(video, index))
                .filter((video): video is PortfolioVideo => video !== null),
        [videos]
    );

    const pauseAllVideos = () => {
        iframesRef.current.forEach((iframe) => {
            if (!iframe?.src || !iframe.contentWindow) {
                return;
            }

            const url = new URL(iframe.src);
            iframe.contentWindow.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                url.origin
            );
        });
    };

    useEffect(() => {
        if (!swiperInstance) {
            return;
        }

        const handleSlideChange = () => {
            pauseAllVideos();
        };

        swiperInstance.on("slideChange", handleSlideChange);

        return () => {
            swiperInstance.off("slideChange", handleSlideChange);
        };
    }, [swiperInstance]);

    useEffect(() => {
        if (!portfolioVideos.length) {
            setVideoMetadata({});
            return;
        }

        let cancelled = false;

        const loadMetadata = async () => {
            const results = await Promise.all(
                portfolioVideos.map(async (video) => {
                    try {
                        const response = await fetch(
                            `/api/youtube/oembed?url=${encodeURIComponent(video.publicUrl)}`
                        );

                        if (!response.ok) {
                            return [video.id, null] as const;
                        }

                        const data = (await response.json()) as VideoMetadata;
                        return [video.id, data] as const;
                    } catch {
                        return [video.id, null] as const;
                    }
                })
            );

            if (cancelled) {
                return;
            }

            setVideoMetadata((prev) => {
                const next = { ...prev };

                results.forEach(([id, data]) => {
                    if (data) {
                        next[id] = data;
                    }
                });

                return next;
            });
        };

        void loadMetadata();

        return () => {
            cancelled = true;
        };
    }, [portfolioVideos]);

    return (
        <section
            id="video-portfolio"
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#0b0b0b",
                color: "#fff",
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                position: "relative",
                overflow: "hidden",
                paddingTop: isMobile ? "88px" : "0",
            }}
        >
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                style={{
                    writingMode: isMobile ? "horizontal-tb" : "vertical-rl",
                    transform: isMobile ? "none" : "rotate(180deg)",
                    textAlign: "center",
                    marginLeft: isMobile ? "0" : "150px",
                    marginRight: isMobile ? "0" : "150px",
                    height: isMobile ? "auto" : "100vh",
                    width: isMobile ? "100%" : "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h3
                    style={{
                        fontSize: isMobile ? "28px" : "60px",
                        lineHeight: isMobile ? "32px" : "65px",
                        fontWeight: 800,
                        margin: 0,
                        letterSpacing: isMobile ? "1px" : "2px",
                        color: "var(--color-orange)",
                        transform: isMobile ? "none" : "rotate(180deg)",
                    }}
                >
                    <span>{t("videos.sectionTitle")}</span>
                </h3>
            </motion.div>

            {portfolioVideos.length === 0 ? (
                <div
                    style={{
                        flex: 1,
                        height: isMobile ? "calc(100vh - 160px)" : "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingRight: isMobile ? "0" : "250px",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: isMobile ? "18px" : "28px",
                            color: "rgba(255,255,255,0.8)",
                        }}
                    >
                        No videos available.
                    </p>
                </div>
            ) : (
                <Swiper
                    direction="vertical"
                    spaceBetween={isMobile ? 24 : 50}
                    slidesPerView={1}
                    allowTouchMove={!isMobile}
                    navigation={
                        portfolioVideos.length > 1
                            ? {
                                  nextEl: ".next-item",
                                  prevEl: ".prev-item",
                              }
                            : false
                    }
                    modules={[Navigation]}
                    onSwiper={setSwiperInstance}
                    style={{
                        width: "100%",
                        height: isMobile ? "calc(100vh - 150px)" : "100vh",
                        paddingLeft: isMobile ? "10px" : "0",
                        paddingRight: isMobile ? "10px" : "250px",
                        paddingBottom: isMobile ? "16px" : "0",
                    }}
                >
                    {portfolioVideos.map((video, index) => {
                        const metadata = videoMetadata[video.id];
                        const title = metadata?.title ?? `Video ${index + 1}`;
                        const channelName = metadata?.authorName ?? "YouTube";
                        const providerName = metadata?.providerName ?? video.platform;

                        return (
                            <SwiperSlide
                                key={video.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: isMobile ? "column" : "row",
                                    height: isMobile ? "calc(100vh - 150px)" : "100vh",
                                    gap: isMobile ? "16px" : "40px",
                                    paddingBottom: isMobile ? "18px" : "0",
                                }}
                            >
                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                style={{
                                    width: isMobile ? "min(90vw, 520px)" : "650px",
                                    height: isMobile ? "min(50vw, 230px)" : "450px",
                                    aspectRatio: "16 / 9",
                                    borderRadius: isMobile ? "14px" : "20px",
                                    overflow: "hidden",
                                    backgroundColor: "#111",
                                    boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                                }}
                            >
                                <iframe
                                    ref={(el) => {
                                        iframesRef.current[index] = el;
                                    }}
                                    src={video.embedUrl}
                                    title={title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                        borderRadius: isMobile ? "14px" : "20px",
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                style={{
                                    width: isMobile ? "min(92vw, 560px)" : "280px",
                                }}
                            >
                                <h4
                                    style={{
                                        fontSize: isMobile ? "22px" : "38px",
                                        lineHeight: isMobile ? "24px" : "38px",
                                        fontWeight: 700,
                                        marginBottom: isMobile ? "10px" : "22px",
                                        color: "var(--color-green)",
                                    }}
                                >
                                    {title}
                                </h4>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    <li style={{ lineHeight: isMobile ? "28px" : "45px", fontSize: isMobile ? "13px" : "16px" }}>
                                        <span style={{ color: "rgba(255,255,255,0.7)", marginRight: "7px" }}>
                                            Channel:
                                        </span>
                                        <span>{channelName}</span>
                                    </li>
                                    <li style={{ lineHeight: isMobile ? "28px" : "45px", fontSize: isMobile ? "13px" : "16px" }}>
                                        <span style={{ color: "rgba(255,255,255,0.7)", marginRight: "7px" }}>
                                            {t("videos.platform")}:
                                        </span>
                                        <span>{providerName}</span>
                                    </li>
                                    <li style={{ lineHeight: isMobile ? "28px" : "45px", fontSize: isMobile ? "13px" : "16px" }}>
                                        <a
                                            href={video.publicUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                color: "var(--color-orange)",
                                                textDecoration: "none",
                                            }}
                                        >
                                            Visit YouTube
                                        </a>
                                    </li>
                                </ul>
                            </motion.div>
                            </SwiperSlide>
                        );
                    })}

                    {portfolioVideos.length > 1 && (
                        <>
                            <motion.button
                                className="prev-item"
                                whileHover={{
                                    scale: 1.1,
                                    borderColor: "var(--color-orange)",
                                    boxShadow: "0 0 12px var(--color-orange)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: "absolute",
                                    right: isMobile ? "76px" : "150px",
                                    top: isMobile ? "auto" : "calc(50vh - 75px)",
                                    bottom: isMobile ? "16px" : "auto",
                                    width: isMobile ? "42px" : "65px",
                                    height: isMobile ? "42px" : "65px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    background: "rgba(255,255,255,0.05)",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    color: "#fff",
                                    fontSize: isMobile ? "16px" : "27px",
                                    lineHeight: isMobile ? "42px" : "65px",
                                    transition: "all 0.3s ease",
                                    zIndex: 8,
                                    pointerEvents: "auto",
                                }}
                            >
                                ^
                            </motion.button>

                            <motion.button
                                className="next-item"
                                whileHover={{
                                    scale: 1.1,
                                    borderColor: "var(--color-green)",
                                    boxShadow: "0 0 12px var(--color-green)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: "absolute",
                                    right: isMobile ? "24px" : "150px",
                                    top: isMobile ? "auto" : "calc(50vh + 15px)",
                                    bottom: isMobile ? "16px" : "auto",
                                    width: isMobile ? "42px" : "65px",
                                    height: isMobile ? "42px" : "65px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    background: "rgba(255,255,255,0.05)",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    color: "#fff",
                                    fontSize: isMobile ? "16px" : "27px",
                                    lineHeight: isMobile ? "42px" : "65px",
                                    transition: "all 0.3s ease",
                                    zIndex: 8,
                                    pointerEvents: "auto",
                                }}
                            >
                                v
                            </motion.button>
                        </>
                    )}
                </Swiper>
            )}
        </section>
    );
}
