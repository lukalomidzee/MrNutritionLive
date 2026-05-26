"use client";

import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useTranslation } from "react-i18next";

type ChannelFeed = {
    key: "mrNutrition" | "nutritionAcademy";
    href: string;
    channelTitle: string | null;
    channelAvatar?: string | null;
    latestVideoTitle: string | null;
    latestVideoUrl: string | null;
    latestVideoPublished: string | null;
    latestVideoThumbnail: string | null;
};

const CHANNEL_URLS = {
    mrNutrition: "https://www.youtube.com/@MrNutrition1",
    nutritionAcademy: "https://www.youtube.com/@NutritionAcademyofGeorgia",
} as const;

const CHANNEL_LOGOS = {
    mrNutrition: "/images/logos/site_logo_green.png",
    nutritionAcademy: "/images/logos/site_logo.png",
} as const;

export default function YouTubeChannelsSection() {
    const { t, i18n } = useTranslation();
    const [channels, setChannels] = React.useState<ChannelFeed[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                const res = await fetch("/api/youtube/channels");
                const data = await res.json();
                if (alive) {
                    setChannels(Array.isArray(data?.channels) ? data.channels : []);
                }
            } catch {
                if (alive) setChannels([]);
            } finally {
                if (alive) setLoading(false);
            }
        };

        load();
        return () => {
            alive = false;
        };
    }, []);

    const fallbackChannels: ChannelFeed[] = [
        {
            key: "mrNutrition",
            href: CHANNEL_URLS.mrNutrition,
            channelTitle: null,
            latestVideoTitle: null,
            latestVideoUrl: null,
            latestVideoPublished: null,
            latestVideoThumbnail: null,
            channelAvatar: null,
        },
        {
            key: "nutritionAcademy",
            href: CHANNEL_URLS.nutritionAcademy,
            channelTitle: null,
            latestVideoTitle: null,
            latestVideoUrl: null,
            latestVideoPublished: null,
            latestVideoThumbnail: null,
            channelAvatar: null,
        },
    ];

    const list = channels.length ? channels : fallbackChannels;

    const formatDate = (isoDate: string | null) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) return "";
        return new Intl.DateTimeFormat(i18n.language === "ka" ? "ka-GE" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const getDefaultTitle = (key: ChannelFeed["key"]) =>
        key === "mrNutrition"
            ? t("youtubeChannels.channels.mrNutrition")
            : t("youtubeChannels.channels.nutritionAcademy");

    return (
        <Box
            component="section"
            sx={{
                px: { xs: 2, md: 4 },
                py: { xs: 5, md: 7 },
                backgroundColor: "var(--color-white)",
            }}
        >
            <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
                <Typography
                    sx={{
                        fontSize: { xs: 26, md: 34 },
                        fontWeight: 800,
                        color: "var(--color-green)",
                        mb: 1,
                    }}
                >
                    {t("youtubeChannels.title")}
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)", mb: 3.5 }}>
                    {t("youtubeChannels.subtitle")}
                </Typography>

                {loading && (
                    <Typography sx={{ color: "rgba(0,0,0,0.6)", mb: 2 }}>
                        {t("youtubeChannels.loading")}
                    </Typography>
                )}

                <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
                    {list.map((channel) => (
                        <Box
                            key={channel.key}
                            sx={{
                                flex: 1,
                                borderRadius: 3,
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                border: "1px solid rgba(0,0,0,0.08)",
                                boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    p: { xs: 2, md: 2.5 },
                                    background:
                                        "linear-gradient(145deg, rgba(255,0,0,0.08), rgba(18,50,87,0.12))",
                                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        component="img"
                                        src={CHANNEL_LOGOS[channel.key]}
                                        alt={channel.channelTitle ?? getDefaultTitle(channel.key)}
                                        sx={{
                                            width: 62,
                                            height: 62,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #fff",
                                            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                                            backgroundColor: "#fff",
                                        }}
                                    />

                                    <Box sx={{ minWidth: 0 }}>
                                        <Stack direction="row" spacing={0.8} alignItems="center">
                                            <YouTubeIcon sx={{ color: "#FF0000", fontSize: 20 }} />
                                            <Typography sx={{ color: "rgba(0,0,0,0.62)", fontSize: 13, fontWeight: 700 }}>
                                                YouTube
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: 18, md: 21 },
                                                color: "var(--color-blue)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {channel.channelTitle ?? getDefaultTitle(channel.key)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                                <Typography sx={{ color: "rgba(0,0,0,0.75)", fontWeight: 700, mb: 1.4 }}>
                                    {t("youtubeChannels.latestVideo")}
                                </Typography>

                                {channel.latestVideoThumbnail ? (
                                    <Stack
                                        component="a"
                                        href={channel.latestVideoUrl ?? channel.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        direction="row"
                                        spacing={1.4}
                                        sx={{
                                            textDecoration: "none",
                                            p: 1,
                                            borderRadius: 2,
                                            border: "1px solid rgba(0,0,0,0.1)",
                                            backgroundColor: "rgba(0,0,0,0.02)",
                                            "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={channel.latestVideoThumbnail}
                                            alt={channel.latestVideoTitle ?? getDefaultTitle(channel.key)}
                                            sx={{
                                                width: { xs: 120, md: 132 },
                                                height: { xs: 68, md: 74 },
                                                borderRadius: 1.5,
                                                objectFit: "cover",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    color: "var(--color-black)",
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    lineHeight: 1.35,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {channel.latestVideoTitle ?? t("youtubeChannels.unavailable")}
                                            </Typography>
                                            {channel.latestVideoPublished && (
                                                <Typography sx={{ color: "rgba(0,0,0,0.56)", fontSize: 12, mt: 0.7 }}>
                                                    {formatDate(channel.latestVideoPublished)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Typography sx={{ color: "rgba(0,0,0,0.72)" }}>
                                        {t("youtubeChannels.unavailable")}
                                    </Typography>
                                )}
                            </Box>

                            <Button
                                component="a"
                                href={channel.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                startIcon={<YouTubeIcon />}
                                sx={{
                                    mt: "auto",
                                    mb: 2.2,
                                    ml: 2.2,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: "999px",
                                    px: 2.2,
                                    alignSelf: "flex-start",
                                    backgroundColor: "var(--color-green)",
                                    "&:hover": { backgroundColor: "var(--color-green-transparent)" },
                                }}
                            >
                                {t("youtubeChannels.visitChannel")}
                            </Button>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
