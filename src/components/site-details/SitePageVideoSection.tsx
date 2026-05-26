"use client";

import { Box } from "@mui/material";
import { useMemo } from "react";
import { useSiteDetails } from "@/components/backend/hooks";
import Video from "@/components/Video";

type Props = {
    pageTypeName: "main" | "courses" | "students";
};

export default function SitePageVideoSection({ pageTypeName }: Readonly<Props>) {
    const { items } = useSiteDetails();

    const page = useMemo(
        () => (items ?? []).find((item) => item.pageTypeName.toLowerCase() === pageTypeName),
        [items, pageTypeName]
    );

    const videoUrl = page?.videoUrl ?? null;
    if (!videoUrl) return null;

    return (
        <Box>
            <Video
                src={videoUrl}
                controls
                autoPlay={false}
                loop={false}
                muted={false}
            />
        </Box>
    );
}
