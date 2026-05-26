"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Avatar,
    Stack,
    Modal,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
    FaFacebookF,
    FaGlobe,
    FaInstagram,
    FaTiktok,
    FaYoutube,
} from "react-icons/fa";
import type { AuthorDTO, AuthorSocialLinkDTO } from "@/components/backend/types";
import { sitePath } from "@/lib/sitePath";

import certificate1 from "../../../public/images/certificates/certificate1.jpg";

type AuthorCardProps = {
    author: AuthorDTO;
};

type PlaylistVideoItem = {
    videoId: string;
    title: string | null;
    url: string;
    publishedAt: string | null;
    thumbnailUrl: string | null;
};

type AuthorEducationRecordView = {
    id: string;
    title?: string | null;
    titleGeo?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    media?: {
        publicUrl?: string | null;
    } | null;
};

const DEFAULT_SOCIAL_ORDER = ["instagram", "youtube", "tiktok", "facebook"] as const;

function normalizeSocialType(value: string | null | undefined): string {
    return (value ?? "").trim().toLowerCase();
}

function getSocialIcon(type: string | null | undefined) {
    switch (normalizeSocialType(type)) {
        case "instagram":
            return <FaInstagram />;
        case "youtube":
            return <FaYoutube />;
        case "tiktok":
            return <FaTiktok />;
        case "facebook":
            return <FaFacebookF />;
        default:
            return <FaGlobe />;
    }
}

function sortSocialLinks(items: AuthorSocialLinkDTO[]): AuthorSocialLinkDTO[] {
    const hasExplicitSort = items.some((item) => item.sortOrder !== null && item.sortOrder !== undefined);

    if (hasExplicitSort) {
        return items.slice().sort((a, b) => {
            const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;

            if (orderA !== orderB) return orderA - orderB;

            return (a.linkTypeName ?? "").localeCompare(b.linkTypeName ?? "");
        });
    }

    const priority = new Map<string, number>(
        DEFAULT_SOCIAL_ORDER.map((name, index) => [name, index])
    );

    return items.slice().sort((a, b) => {
        const rankA = priority.get(normalizeSocialType(a.linkTypeName)) ?? Number.MAX_SAFE_INTEGER;
        const rankB = priority.get(normalizeSocialType(b.linkTypeName)) ?? Number.MAX_SAFE_INTEGER;

        if (rankA !== rankB) return rankA - rankB;

        const typeCompare = (a.linkTypeName ?? "").localeCompare(b.linkTypeName ?? "");
        if (typeCompare !== 0) return typeCompare;

        return (a.linkUrl ?? "").localeCompare(b.linkUrl ?? "");
    });
}

function toYoutubeEmbedUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        if (host.includes("youtu.be")) {
            const videoId = parsed.pathname.replace("/", "");
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        if (host.includes("youtube.com")) {
            if (parsed.pathname === "/watch") {
                const videoId = parsed.searchParams.get("v");
                return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
            }

            if (parsed.pathname.startsWith("/embed/")) {
                return url;
            }
        }
    } catch {
        return null;
    }

    return null;
}

function extractYoutubePlaylistId(url: string | null | undefined): string | null {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const playlistId = parsed.searchParams.get("list");

        return playlistId;
    } catch {
        return null;
    }
}

function toYoutubeEmbedUrlByVideoId(videoId: string | null | undefined): string | null {
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function formatCertificateDate(date: string, locale: string): string {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
    }).format(new Date(date));
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
    const { i18n, t } = useTranslation();
    const isGeorgian = i18n.language === "ka";
    const theme = useTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });

    const [openImage, setOpenImage] = useState<string | null>(null);
    const [playlistItems, setPlaylistItems] = useState<PlaylistVideoItem[]>([]);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [selectedPlaylistVideoId, setSelectedPlaylistVideoId] = useState<string | null>(null);

    const fullName = isGeorgian
        ? `${author.firstNameGeo} ${author.lastNameGeo}`
        : `${author.firstName} ${author.lastName}`;

    const title = isGeorgian ? author.titleGeo : author.title;
    const description = isGeorgian ? author.descriptionGeo : author.description;
    const dateLocale = isGeorgian ? "ka-GE" : "en-US";

    const certificates = useMemo(() => {
        return (author.educationRecords ?? [])
            .map((record) => {
                const education = record as unknown as AuthorEducationRecordView;
                const localizedTitle = isGeorgian
                    ? education.titleGeo || education.title
                    : education.title || education.titleGeo;

                return {
                    id: education.id,
                    title: localizedTitle || t("author.coachCertificate"),
                    startDate: education.startDate ?? null,
                    endDate: education.endDate ?? null,
                    image: education.media?.publicUrl ?? certificate1.src,
                };
            })
            .sort((a, b) => {
                const aDate = new Date(a.endDate ?? a.startDate ?? 0).getTime();
                const bDate = new Date(b.endDate ?? b.startDate ?? 0).getTime();
                return bDate - aDate;
            });
    }, [author.educationRecords, isGeorgian, t]);

    const socials = useMemo(
        () =>
            sortSocialLinks(
                (author.socialLinks ?? []).filter((item) => Boolean(item.linkUrl))
            ).map((item) => ({
                id: item.id,
                icon: getSocialIcon(item.linkTypeName),
                label: item.title ?? item.linkTypeName,
                href: item.linkUrl,
            })),
        [author.socialLinks]
    );

    const playlistId = extractYoutubePlaylistId(author.playlistUrl);
    const mainVideoEmbedUrl = toYoutubeEmbedUrl(author.videoUrl);
    const selectedPlaylistEmbedUrl = toYoutubeEmbedUrlByVideoId(selectedPlaylistVideoId);
    const activeVideoUrl = selectedPlaylistEmbedUrl ?? mainVideoEmbedUrl;
    const hasVideoSection = Boolean(mainVideoEmbedUrl || playlistId);

    useEffect(() => {
        if (!playlistId) {
            setPlaylistItems([]);
            setSelectedPlaylistVideoId(null);
            return;
        }

        let cancelled = false;

        (async () => {
            setPlaylistLoading(true);

            try {
                const res = await fetch(`/api/youtube/playlist?playlistId=${encodeURIComponent(playlistId)}`);
                const data = (await res.json()) as { items?: PlaylistVideoItem[] };

                if (cancelled) return;

                const items = data.items ?? [];
                setPlaylistItems(items);

                if (!mainVideoEmbedUrl && items[0]?.videoId) {
                    setSelectedPlaylistVideoId(items[0].videoId);
                } else {
                    setSelectedPlaylistVideoId(null);
                }
            } catch {
                if (cancelled) return;
                setPlaylistItems([]);
                setSelectedPlaylistVideoId(null);
            } finally {
                if (!cancelled) {
                    setPlaylistLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [playlistId, mainVideoEmbedUrl]);

    return (
        <Box sx={{ backgroundColor: "#F6F5E3" }}>
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    px: { xs: 3, md: 10 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 5, md: 10 },
                    textAlign: { xs: "center", md: "left" },
                    backgroundImage: author.backgroundUrl
                        ? `linear-gradient(rgba(246,245,227,0.9), rgba(246,245,227,0.92)), url(${author.backgroundUrl})`
                        : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Avatar
                    src={author.coverUrl ?? undefined}
                    alt={fullName}
                    sx={{
                        width: { xs: 160, md: 260 },
                        height: { xs: 160, md: 260 },
                        borderRadius: "50%",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                        border: "3px solid var(--color-green)",
                    }}
                />

                <Stack spacing={3} maxWidth={650}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: "var(--color-green)",
                            fontFamily: "Livvic, sans-serif",
                            fontSize: { xs: "1.9rem", md: "3rem" },
                            lineHeight: { xs: 1.2, md: 1.167 },
                        }}
                    >
                        {fullName}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "var(--color-blue)",
                            fontWeight: 600,
                            fontFamily: "Livvic, sans-serif",
                            fontSize: { xs: "1.15rem", md: "1.5rem" },
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            color: "var(--color-black)",
                            fontSize: { xs: 14, md: 18 },
                            lineHeight: { xs: 1.55, md: 1.8 },
                            fontFamily: "Livvic, sans-serif",
                        }}
                    >
                        {description}
                    </Typography>
                </Stack>
            </Box>

            <section
                style={{
                    background: "#F6F5E3",
                    color: "#0b0b0b",
                    width: "100%",
                    padding: isPhone ? "84px 0 20px" : "120px 0",
                    fontFamily: "Livvic, sans-serif",
                    overflow: "hidden",
                }}
            >
                <Typography
                    sx={{
                        fontSize: isPhone ? "26px" : "38px",
                        fontWeight: 700,
                        letterSpacing: isPhone ? "1px" : "2px",
                        color: "var(--color-orange)",
                        textTransform: "uppercase",
                        textAlign: "center",
                        mb: isPhone ? 3 : 8,
                    }}
                >
                    {t("student.certificates")}
                </Typography>

                <Box
                    sx={{
                        position: "relative",
                        width: isPhone ? "92%" : "80%",
                        margin: "0 auto",
                        height: isPhone ? "auto" : "80vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: isPhone ? "column" : "row",
                    }}
                >
                    {!isPhone ? (
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                width: "100%",
                                height: "3px",
                                transform: "translateY(-50%)",
                                background:
                                    "linear-gradient(90deg, var(--color-orange), rgba(0,0,0,0.08))",
                                borderRadius: "4px",
                            }}
                        />
                    ) : (
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                width: "3px",
                                height: "100%",
                                transform: "translateX(-50%)",
                                background:
                                    "linear-gradient(180deg, var(--color-orange), rgba(0,0,0,0.08))",
                                borderRadius: "4px",
                            }}
                        />
                    )}

                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexDirection: isPhone ? "column" : "row",
                            gap: isPhone ? 5 : 0,
                        }}
                    >
                        {certificates.map((cert, i) => {
                            const isTop = i % 2 === 0;
                            const yOffset = isPhone ? 0 : isTop ? -180 : 180;
                            const diamondColor = "var(--color-green)";
                            const dateText =
                                cert.startDate && cert.endDate
                                    ? `${formatCertificateDate(cert.startDate, dateLocale)} - ${formatCertificateDate(cert.endDate, dateLocale)}`
                                    : cert.startDate
                                        ? formatCertificateDate(cert.startDate, dateLocale)
                                        : cert.endDate
                                            ? formatCertificateDate(cert.endDate, dateLocale)
                                            : "";

                            return (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, y: yOffset * 1.2 }}
                                    whileInView={{ opacity: 1, y: yOffset }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, delay: i * 0.15 }}
                                    style={{
                                        position: "relative",
                                        width: isPhone ? "min(74vw, 290px)" : "260px",
                                        height: isPhone ? "160px" : "200px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        alignSelf: isPhone ? (isTop ? "flex-start" : "flex-end") : "auto",
                                        transform: isPhone ? "none" : `translateY(${yOffset}px)`,
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            ...(isPhone
                                                ? {
                                                    top: "50%",
                                                    [i % 2 === 0 ? "right" : "left"]: "-9px",
                                                    transform: "translateY(-50%) rotate(45deg)",
                                                }
                                                : {
                                                    top: isTop ? "calc(100%)" : "0px",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%) rotate(45deg)",
                                                }),
                                            width: "18px",
                                            height: "18px",
                                            background: diamondColor,
                                            boxShadow: `0 0 18px ${diamondColor}`,
                                            zIndex: 3,
                                        }}
                                    />

                                    <motion.div
                                        whileHover={{ rotateY: 180 }}
                                        transition={{ duration: 0.9, ease: "easeInOut" }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            perspective: "1000px",
                                            transformStyle: "preserve-3d",
                                            position: "relative",
                                            borderRadius: "16px",
                                            background: "rgba(246,245,227,0.92)",
                                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                            border: "1px solid rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                backfaceVisibility: "hidden",
                                                borderRadius: "16px",
                                                p: isPhone ? 1.4 : 2,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "var(--color-orange)",
                                                    fontSize: isPhone ? "13px" : "18px",
                                                    fontWeight: 700,
                                                    mb: isPhone ? 0.4 : 1,
                                                }}
                                            >
                                                {cert.title}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "rgba(0,0,0,0.75)",
                                                    fontSize: isPhone ? "10px" : "13px",
                                                }}
                                            >
                                                {dateText || "-"}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                transform: "rotateY(180deg)",
                                                backfaceVisibility: "hidden",
                                                borderRadius: "16px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                background:
                                                    "linear-gradient(180deg, rgba(255,255,255,0.65), rgba(246,245,227,0.95) 90%)",
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={cert.image}
                                                alt={cert.title}
                                                sx={{
                                                    width: isPhone ? "78%" : "75%",
                                                    height: isPhone ? "86px" : "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    mb: 1.5,
                                                    border: "1px solid rgba(0,0,0,0.06)",
                                                    transition: "transform 0.3s ease",
                                                    "&:hover": { transform: "scale(1.05)" },
                                                }}
                                                onClick={() => setOpenImage(cert.image)}
                                            />
                                        </Box>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </Box>
                </Box>

                <Modal
                    open={!!openImage}
                    onClose={() => setOpenImage(null)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "min(760px, 88vw)",
                            height: "min(72vh, 620px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IconButton
                            onClick={() => setOpenImage(null)}
                            sx={{
                                position: "absolute",
                                top: -50,
                                right: 0,
                                color: "var(--color-black)",
                                bgcolor: "rgba(255,255,255,0.9)",
                                border: "1px solid rgba(0,0,0,0.06)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                            }}
                        >
                            <Close />
                        </IconButton>
                        <Box
                            component="img"
                            src={openImage ?? ""}
                            alt="Certificate"
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                borderRadius: 2,
                                boxShadow: "0 0 50px rgba(0,0,0,0.2)",
                            }}
                        />
                    </Box>
                </Modal>
            </section>

            {hasVideoSection && (
                <Box
                    sx={{
                        position: "relative",
                        background: "#F6F5E3",
                        color: "#0b0b0b",
                        textAlign: "center",
                        py: 10,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: "var(--color-orange)",
                            fontWeight: 700,
                            mb: 5,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            fontSize: { xs: "1.6rem", md: "2.125rem" },
                        }}
                    >
                        {t("student.introVideo")}
                    </Typography>
                    <Box
                        sx={{
                            width: { xs: "94%", md: "min(1180px, 88%)" },
                            margin: "0 auto",
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                lg: playlistId ? "minmax(0, 1fr) 340px" : "1fr",
                            },
                            gap: 3,
                            alignItems: "start",
                        }}
                    >
                            <Box
                                sx={{
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                    backgroundColor: "#111",
                                    maxWidth: { xs: "100%", md: "none" },
                                }}
                            >
                            {activeVideoUrl ? (
                                <Box sx={{ aspectRatio: "16/9" }}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={activeVideoUrl}
                                        title="Author introduction"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        aspectRatio: "16/9",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontWeight: 600,
                                        px: 3,
                                    }}
                                >
                                    {playlistLoading ? "Loading playlist..." : "No video available"}
                                </Box>
                            )}
                        </Box>

                        {playlistId && (
                            <Box
                                sx={{
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                                    background:
                                        "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(246,245,227,0.98))",
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    p: 2,
                                    height: {
                                        xs: "360px",
                                        sm: "420px",
                                        lg: "calc((min(1180px, 88vw) - 340px - 24px) * 9 / 16)",
                                    },
                                    maxHeight: {
                                        xs: "420px",
                                        lg: "min(540px, calc((100vw - 340px - 24px) * 9 / 16))",
                                    },
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mb: 1.5 }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: "var(--color-green)",
                                            textAlign: "left",
                                        }}
                                    >
                                        Playlist
                                    </Typography>

                                    {selectedPlaylistVideoId && mainVideoEmbedUrl && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => setSelectedPlaylistVideoId(null)}
                                            sx={{
                                                textTransform: "none",
                                                borderColor: "var(--color-green)",
                                                color: "var(--color-green)",
                                                fontWeight: 700,
                                                minWidth: 0,
                                                px: 1.5,
                                                "&:hover": {
                                                    borderColor: "var(--color-orange)",
                                                    color: "var(--color-orange)",
                                                },
                                            }}
                                        >
                                            Back
                                        </Button>
                                    )}
                                </Stack>

                                <Box
                                    sx={{
                                        flex: 1,
                                        minHeight: 0,
                                        overflowY: "auto",
                                        pr: 0.5,
                                        mr: -0.5,
                                        scrollbarWidth: "thin",
                                        scrollbarColor: "var(--color-orange) rgba(0,0,0,0.08)",
                                        "&::-webkit-scrollbar": {
                                            width: "8px",
                                        },
                                        "&::-webkit-scrollbar-track": {
                                            background: "rgba(0,0,0,0.08)",
                                            borderRadius: "999px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            background: "var(--color-orange)",
                                            borderRadius: "999px",
                                        },
                                    }}
                                >
                                <Stack spacing={1.25}>
                                    {playlistLoading && playlistItems.length === 0 && (
                                        <Typography sx={{ color: "rgba(0,0,0,0.65)", textAlign: "left" }}>
                                            Loading playlist...
                                        </Typography>
                                    )}

                                    {!playlistLoading && playlistItems.length === 0 && (
                                        <Typography sx={{ color: "rgba(0,0,0,0.65)", textAlign: "left" }}>
                                            Playlist videos are not available.
                                        </Typography>
                                    )}

                                    {playlistItems.map((item, index) => {
                                        const isSelected = item.videoId === selectedPlaylistVideoId;

                                        return (
                                            <Box
                                                key={item.videoId}
                                                onClick={() => setSelectedPlaylistVideoId(item.videoId)}
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "96px minmax(0, 1fr)", md: "120px minmax(0, 1fr)" },
                                                    gap: 1.25,
                                                    p: 1,
                                                    borderRadius: 2,
                                                    cursor: "pointer",
                                                    border: isSelected
                                                        ? "1px solid var(--color-orange)"
                                                        : "1px solid rgba(0,0,0,0.06)",
                                                    backgroundColor: isSelected
                                                        ? "rgba(255,145,76,0.1)"
                                                        : "rgba(255,255,255,0.7)",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        borderColor: "var(--color-orange)",
                                                        transform: "translateY(-1px)",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={item.thumbnailUrl ?? sitePath("/images/courses/course1.jpg")}
                                                    alt={item.title ?? `Playlist video ${index + 1}`}
                                                    sx={{
                                                        width: "100%",
                                                        aspectRatio: "16/9",
                                                        objectFit: "cover",
                                                        borderRadius: 1.5,
                                                    }}
                                                />

                                                <Stack justifyContent="center" spacing={0.5} sx={{ minWidth: 0 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: 12, md: 14 },
                                                            fontWeight: 700,
                                                            color: "#0b0b0b",
                                                            textAlign: "left",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {item.title ?? `Video ${index + 1}`}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: 11, md: 12 },
                                                            color: "rgba(0,0,0,0.6)",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        Click to play in main player
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            {socials.length > 0 && (
                <Box
                    sx={{
                        background: "#F6F5E3",
                        py: 10,
                        textAlign: "center",
                        color: "#0b0b0b",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: "26px", md: "38px" },
                            fontWeight: 700,
                            letterSpacing: { xs: "1px", md: "2px" },
                            color: "var(--color-orange)",
                            textTransform: "uppercase",
                            mb: { xs: 3, md: 8 },
                        }}
                    >
                        {t("student.getInTouch")}
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 4,
                            maxWidth: 900,
                            margin: "0 auto",
                        }}
                    >
                        {socials.map((s, i) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.2 + i * 0.15,
                                    duration: 0.7,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                            >
                                <Box
                                    component="a"
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        width: isPhone ? 155 : 340,
                                        height: isPhone ? 140 : 240,
                                        mx: "auto",
                                        borderRadius: "20px",
                                        background:
                                            "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(246,245,227,0.95))",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        transition: "transform 0.4s ease",
                                        border: "1px solid rgba(0,0,0,0.06)",
                                        textDecoration: "none",
                                        "&:hover": {
                                            transform: isPhone ? "none" : "translateY(-10px) scale(1.03)",
                                        },
                                        position: "relative",
                                    }}
                                >
                                    <Stack
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        spacing={1.5}
                                        sx={{ height: "100%", position: "relative", zIndex: 1 }}
                                    >
                                        <Box sx={{ fontSize: isPhone ? 30 : 46, color: "var(--color-orange)" }}>
                                            {s.icon}
                                        </Box>
                                        <Typography
                                            sx={{
                                                fontSize: isPhone ? 14 : 22,
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                color: "#0b0b0b",
                                                letterSpacing: 1,
                                            }}
                                        >
                                            {s.label}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AuthorCard;
