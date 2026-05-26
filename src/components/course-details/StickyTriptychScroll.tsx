"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";

export type Section = {
    id: string;
    title: string;
    text: string;
    image: string;
};

export type StickyTriptychScrollProps = {
    sections: Section[];
    leftWidth?: number;
    rightWidth?: number;
    heightVH?: number;
    id?: string;
    className?: string;
};

const COLORS = {
    background: "var(--color-black)",
    text: "var(--color-white)",
    headerDefault: "var(--color-green)",
    headerActive: "var(--color-orange)",
    headerSelected: "var(--color-blue)",
};

export default function StickyTriptychScroll({
                                                 sections,
                                                 leftWidth = 400,
                                                 rightWidth = 600,
                                                 heightVH = 100,
                                                 id,
                                                 className,
                                             }: Readonly<StickyTriptychScrollProps>) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const stepRefs = useRef<HTMLDivElement[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const items = useMemo(() => sections.filter(Boolean), [sections]);

    useEffect(() => {
        if (!wrapperRef.current || stepRefs.current.length === 0) return;

        const io = new IntersectionObserver(
            (entries) => {
                const top = entries
                    .slice()
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (top) {
                    const idx = stepRefs.current.findIndex((n) => n === top.target);
                    if (idx !== -1) setActiveIndex(idx);
                }
            },
            {
                root: null,
                threshold: [0.4, 0.6, 0.8],
            }
        );

        stepRefs.current.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, [items.length]);

    const scrollToIndex = (idx: number) => {
        const target = stepRefs.current[idx];
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <Box
            ref={wrapperRef}
            id={id}
            className={className}
            sx={{ position: "relative", width: "100%", backgroundColor: COLORS.background }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: `1fr`,
                        md: `${leftWidth}px minmax(0, 1fr) ${rightWidth}px`,
                    },
                    columnGap: { xs: 2, md: 4 },
                    alignItems: "start",
                    color: COLORS.text,
                    px: { xs: 2, md: "40px" },
                }}
            >
                {/* LEFT: sticky headers */}
                <Box
                    sx={{
                        position: { md: "sticky" },
                        top: 0,
                        height: { md: "100dvh" },
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        justifyContent: "center",
                        px: 2,
                    }}
                >
                    <List dense disablePadding>
                        {items.map((s, i) => (
                            <ListItem key={s.id} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => scrollToIndex(i)}
                                    sx={{
                                        borderRadius: 1.5,
                                        transition: "all .2s",
                                        backgroundColor: i === activeIndex ? COLORS.headerActive : "transparent",
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontSize: "25px",
                                                    fontWeight: i === activeIndex ? 700 : 500,
                                                    color: i === activeIndex ? COLORS.headerSelected : COLORS.headerDefault,
                                                }}
                                            >
                                                {s.title}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* CENTER: page-scrolling sections */}
                <Box>
                    {items.map((s, i) => (
                        <Box
                            key={s.id}
                            ref={(n) => {
                                if (n) stepRefs.current[i] = n as HTMLDivElement;
                            }}
                            sx={{
                                minHeight: { xs: "72dvh", md: `${heightVH}dvh` },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 2,
                                pr: { md: 2 },
                                py: { xs: 2, md: 0 },
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    display: { xs: "block", md: "none" },
                                    color: COLORS.headerDefault,
                                    fontSize: { xs: "1.4rem", md: "2.125rem" },
                                }}
                            >
                                {s.title}
                            </Typography>

                            <Box
                                component="img"
                                src={s.image}
                                alt={s.title}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                    width: "100%",
                                    maxHeight: "240px",
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                                    mb: 1,
                                }}
                            />

                            <Typography variant="body1" sx={{ fontSize: { xs: 14, md: 18 }, lineHeight: { xs: 1.55, md: 1.7 }, color: COLORS.text }}>
                                {s.text}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* RIGHT: sticky image with much faster cross-fade */}
                <Box
                    sx={{
                        position: { md: "sticky" },
                        top: 0,
                        height: { md: "100dvh" },
                        display: { xs: "none", md: "flex" },
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    {items.map((s, i) => (
                        <Box
                            key={s.id}
                            component="img"
                            src={s.image}
                            alt={s.title}
                            sx={{
                                position: "absolute",
                                maxHeight: "90%",
                                maxWidth: "90%",
                                objectFit: "contain",
                                borderRadius: 2,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                transition: "opacity 0.3s ease-in-out, filter 0.3s ease-in-out",
                                opacity: i === activeIndex ? 1 : 0,
                                filter: i === activeIndex ? "brightness(1)" : "brightness(0.3)",
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
