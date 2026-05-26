"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export type TutorDescriptionProps = {
    id: string;
    name: string;
    surname: string;
    subjectName: string;
    description: string;
    imagePath: string;
};

const TutorDescriptionCard: React.FC<TutorDescriptionProps> = ({
                                                                   id,
                                                                   name,
                                                                   surname,
                                                                   subjectName,
                                                                   description,
                                                                   imagePath,
                                                               }) => (
    <Box
        component={Link}
        href={`/students/${id}`}
        sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            cursor: "pointer",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
            },
            "&:hover .description": {
                maxHeight: "100px",
                opacity: 1,
            },
        }}
    >
        <Box component="img" src={imagePath} alt={`${name} ${surname}`} sx={{ width: "100%", display: "block" }} />

        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "var(--color-green-transparent)",
                color: "var(--color-orange)",
                p: 1,
                px: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: "bold", lineHeight: 1.1 }}>
                {name} {surname}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {subjectName}
            </Typography>
            <Typography
                className="description"
                sx={{
                    maxHeight: 0,
                    opacity: 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease, opacity 0.3s ease",
                    lineHeight: 1.4,
                    mt: 0.5,
                }}
            >
                {description}
            </Typography>
        </Box>
    </Box>
);

export default TutorDescriptionCard;
