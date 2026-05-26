"use client";

import React, { useState } from "react";
import { Box, Typography, Modal, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import certificate1 from "../../../public/images/certificates/certificate1.jpg";
import certificate2 from "../../../public/images/certificates/certificate2.jpg";

type StudentCertificateView = {
    id: string;
    title: string;
    issueDate: string;
    validityDays: number | null;
    image: string;
};

export default function StudentCertificatesSection({ student, getLang }: any) {
    const { t } = useTranslation();
    const [openImage, setOpenImage] = useState<string | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const certificates: StudentCertificateView[] = (student.enrollments ?? [])
        .map((enrollment: any, index: number) => ({
            id: enrollment.id,
            title: getLang(enrollment.courseNameGeo, enrollment.courseName),
            issueDate: enrollment.certificationDate,
            validityDays: enrollment.validityPeriodInDays ?? null,
            image:
                student.media?.find((item: any) => item.mediaAssetId === enrollment.certificateMediaAssetId)
                    ?.publicUrl ?? (index % 2 === 0 ? certificate1.src : certificate2.src),
        }))
        .filter((item: { issueDate?: string | null }) => Boolean(item.issueDate))
        .sort((a: { issueDate: string }, b: { issueDate: string }) =>
            new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
        );

    const calcDaysLeft = (date: string, validityDays?: number | null) => {
        const issue = new Date(date);
        const exp = new Date(issue);
        exp.setDate(exp.getDate() + (validityDays ?? 720));
        const diff = exp.getTime() - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 0) return t("student.expired");
        return t("student.daysLeft", { count: days });
    };

    return (
        <section
            style={{
                position: "relative",
                background: "#0b0b0b",
                color: "#fff",
                width: "100vw",
                minHeight: "100vh",
                padding: isMobile ? "88px 0 24px" : "120px 0",
                overflow: "hidden",
                fontFamily: "Livvic, sans-serif",
            }}
        >
            <div
                style={{
                    position: isMobile ? "relative" : "absolute",
                    left: isMobile ? "auto" : "50px",
                    top: isMobile ? "auto" : "calc(50% + 40px)",
                    transform: isMobile ? "none" : "translateY(-50%) rotate(-90deg)",
                    transformOrigin: "left center",
                    textAlign: isMobile ? "center" : "left",
                    marginBottom: isMobile ? "16px" : 0,
                }}
            >
                <Typography
                    sx={{
                        fontSize: isMobile ? "26px" : "38px",
                        fontWeight: 700,
                        letterSpacing: isMobile ? "1px" : "2px",
                        color: "var(--color-orange)",
                        textTransform: "uppercase",
                    }}
                >
                    {t("student.certificates")}
                </Typography>
            </div>

            <Box
                sx={{
                    position: "relative",
                    width: isMobile ? "92%" : "80%",
                    margin: "0 auto",
                    height: isMobile ? "auto" : "80vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                {!isMobile ? (
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
                                "linear-gradient(90deg, var(--color-orange), rgba(255,255,255,0.2))",
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
                                "linear-gradient(180deg, var(--color-orange), rgba(255,255,255,0.2))",
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
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? 5 : 0,
                    }}
                >
                    {certificates.map((cert, i) => {
                        const isTop = i % 2 === 0;
                        const yOffset = isMobile ? 0 : isTop ? -180 : 180;
                        const isExpired = calcDaysLeft(cert.issueDate, cert.validityDays) === t("student.expired");
                        const diamondColor = isExpired ? "var(--color-orange)" : "var(--color-green)";

                        return (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: yOffset * 1.2 }}
                                whileInView={{ opacity: 1, y: yOffset }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: i * 0.15 }}
                                style={{
                                    position: "relative",
                                    width: isMobile ? "min(74vw, 290px)" : "260px",
                                    height: isMobile ? "160px" : "200px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: isMobile ? (isTop ? "flex-start" : "flex-end") : "auto",
                                    transform: !isMobile ? `translateY(${yOffset}px)` : "none",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        ...(isMobile
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
                                        boxShadow: `0 0 25px ${diamondColor}`,
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
                                        background:
                                            "linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)",
                                        boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            backfaceVisibility: "hidden",
                                            borderRadius: "16px",
                                            p: isMobile ? 1.5 : 2,
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
                                                fontSize: isMobile ? "13px" : "18px",
                                                fontWeight: 700,
                                                mb: isMobile ? 0.5 : 1,
                                            }}
                                        >
                                            {cert.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "rgba(255,255,255,0.8)",
                                                fontSize: isMobile ? "11px" : "13px",
                                                mb: isMobile ? 0.3 : 0.6,
                                            }}
                                        >
                                            {t("student.academy")}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "rgba(255,255,255,0.6)",
                                                fontSize: isMobile ? "10px" : "12px",
                                            }}
                                        >
                                            {t("student.issuedOn")}:{" "}
                                            {new Date(cert.issueDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color:
                                                    calcDaysLeft(cert.issueDate, cert.validityDays) ===
                                                    t("student.expired")
                                                        ? "var(--color-orange)"
                                                        : "var(--color-green)",
                                                fontWeight: 600,
                                                fontSize: isMobile ? "11px" : "13px",
                                                mt: isMobile ? 0.6 : 1,
                                            }}
                                        >
                                            {calcDaysLeft(cert.issueDate, cert.validityDays)}
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
                                                "linear-gradient(180deg, #141414, #0d0d0d 90%)",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={cert.image}
                                            alt={cert.title}
                                            sx={{
                                                width: isMobile ? "78%" : "75%",
                                                height: isMobile ? "86px" : "120px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                mb: 1.5,
                                                border: "1px solid rgba(255,255,255,0.1)",
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
                        maxWidth: "90vw",
                        maxHeight: "80vh",
                    }}
                >
                    <IconButton
                        onClick={() => setOpenImage(null)}
                        sx={{
                            position: "absolute",
                            top: -50,
                            right: 0,
                            color: "var(--color-white)",
                            bgcolor: "rgba(0,0,0,0.4)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
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
                            height: "auto",
                            borderRadius: 2,
                            boxShadow: "0 0 50px rgba(0,0,0,0.7)",
                        }}
                    />
                </Box>
            </Modal>
        </section>
    );
}
