"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import React, { useMemo } from "react";

interface VideoProps {
    src: string;
    poster?: string;
    controls?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    width?: number | string;
    height?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    aspectRatio?: string;
    style?: React.CSSProperties;
    className?: string;
}

const Video: React.FC<VideoProps> = ({
                                         src,
                                         poster,
                                         controls = true,
                                         autoPlay = false,
                                         loop = false,
                                         muted = false,
                                         width,
                                         height,
                                         maxWidth = "100%",
                                         maxHeight,
                                         aspectRatio,
                                         style,
                                         className,
                                     }) => {
    const ease = [0.43, 0.13, 0.23, 0.96] as const;
    const { t } = useTranslation();
    const isExternalEmbed = useMemo(() => {
        try {
            const url = new URL(src);
            const host = url.hostname.toLowerCase();
            return host.includes("youtube.com") || host.includes("youtu.be") || host.includes("vimeo.com");
        } catch {
            return false;
        }
    }, [src]);

    const embedUrl = useMemo(() => {
        if (!isExternalEmbed) return src;

        try {
            const url = new URL(src);
            const host = url.hostname.toLowerCase();

            if (host.includes("youtu.be")) {
                const id = url.pathname.replace("/", "");
                return id ? `https://www.youtube.com/embed/${id}` : src;
            }

            if (host.includes("youtube.com")) {
                if (url.pathname.startsWith("/embed/")) return src;
                const id = url.searchParams.get("v");
                return id ? `https://www.youtube.com/embed/${id}` : src;
            }

            if (host.includes("vimeo.com")) {
                const id = url.pathname.split("/").filter(Boolean)[0];
                return id ? `https://player.vimeo.com/video/${id}` : src;
            }
        } catch {
            return src;
        }

        return src;
    }, [isExternalEmbed, src]);

    const boxStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: width ?? "100%",
        height: height ?? "auto",
        maxWidth,
        maxHeight,
        aspectRatio: aspectRatio ?? "16 / 9",
        overflow: "hidden",
        backgroundColor: "inherit",
        ...style,
    };

    return (
        <Box
            className={className ? className + " video-container" : "video-container"}
            sx={boxStyle}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease }}
                viewport={{ once: true }}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {isExternalEmbed ? (
                    <iframe
                        src={embedUrl}
                        title={t("videoPlayer")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                    />
                ) : (
                    <video
                        src={src}
                        poster={poster}
                        controls={controls}
                        autoPlay={autoPlay}
                        loop={loop}
                        muted={muted}
                        title={t("videoPlayer")}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                )}
            </motion.div>
        </Box>
    );
};

export default Video;
