"use client";

import { Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import FadeIn from "@/lib/motion/FadeIn";
import TutorSlidesClient from "@/components/landing/tutors/TutorSlidesClient";

const TutorsClient = () => {
    const { t } = useTranslation();

    return (
        <>
            <Box
                id="Students-Title"
                sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
                <Typography
                    sx={{
                        fontSize: "28px",
                        fontFamily: "Noto Sans Georgian",
                        fontWeight: "bold",
                        m: 3,
                    }}
                >
                    {t("ourStudents")}
                </Typography>

                <Divider
                    sx={{
                        width: 100,
                        height: 2,
                        backgroundColor: "var(--color-orange)",
                        borderRadius: 2,
                        mx: 3,
                    }}
                />
            </Box>

            <FadeIn>
                <TutorSlidesClient />
            </FadeIn>
        </>
    );
};

export default TutorsClient;
