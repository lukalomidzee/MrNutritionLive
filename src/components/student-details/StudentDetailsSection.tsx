"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMediaQuery, useTheme } from "@mui/material";

export default function StudentDetailsSection({ student, getLang }: any) {
    const { t, i18n } = useTranslation();
    const isGeorgian = i18n.language === "ka";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const firstName = getLang(student.firstNameGeo, student.firstName);
    const lastName = getLang(student.lastNameGeo, student.lastName);
    const photo = student.coverUrl || "/images/default.jpg";
    const age = student.age || t("student.ageValue");
    const email = student.email || t("student.emailValue");
    const phone = student.phoneNumber || t("student.phoneNumberValue");
    const gender = getLang(student.genderGeo, student.gender) || t("student.genderValue");
    const birthDate = student.birthDate
        ? new Intl.DateTimeFormat(isGeorgian ? "ka-GE" : "en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
        }).format(new Date(student.birthDate))
        : t("student.birthDateValue");

    const formatRecords = (
        records: any[],
        englishKey: string,
        georgianKey: string,
        fallback: string
    ) => {
        const values = (records ?? [])
            .map((record) => {
                const englishValue = record?.[englishKey];
                const georgianValue = record?.[georgianKey];
                return getLang(georgianValue, englishValue);
            })
            .filter(Boolean);

        return values.length > 0 ? values.join(", ") : fallback;
    };

    const infoLeft = [
        [t("student.age"), `${age}`],
        [t("student.birthDate"), birthDate],
        ...(student.emailVisible ? [[t("student.email"), email] as const] : []),
        ...(student.phoneVisible ? [[t("student.phoneNumber"), phone] as const] : []),
        [t("student.gender"), gender],
    ];

    const infoRight = [
        [
            t("student.professions"),
            formatRecords(
                student.professionRecords,
                "professionTypeName",
                "professionTypeNameGeo",
                t("student.professionsValue")
            ),
        ],
        [
            t("student.education"),
            formatRecords(
                student.educationRecords,
                "title",
                "titleGeo",
                t("student.educationValue")
            ),
        ],
        [
            t("student.languages"),
            formatRecords(
                student.languageRecords,
                "languageTypeName",
                "languageTypeNameGeo",
                t("student.languagesValue")
            ),
        ],
        [
            t("student.experience"),
            formatRecords(
                student.workExperienceRecords,
                "workTypeName",
                "workTypeNameGeo",
                t("student.experienceValue")
            ),
        ],
    ];

    /** Fade-in animation (Salimov style) */
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: (i: number = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
            },
        }),
    };

    return (
        <section
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                backgroundColor: "#0b0b0b",
                color: "#fff",
                width: "100%",
                minHeight: "100vh",
                paddingLeft: isMobile ? "16px" : "150px",
                paddingRight: isMobile ? "16px" : "0",
                paddingTop: isMobile ? "88px" : "0",
                paddingBottom: isMobile ? "24px" : "0",
                boxSizing: "border-box",
                fontFamily: "Livvic, sans-serif",
            }}
        >
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{
                    display: "flex",
                    alignItems: isMobile ? "center" : "flex-start",
                    flexWrap: "wrap",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                {/* === IMAGE === */}
                <motion.div
                    variants={fadeInUp}
                    custom={0}
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        width: isMobile ? "min(74vw, 260px)" : "380px",
                        height: isMobile ? "min(88vw, 320px)" : "470px",
                        borderRadius: isMobile ? "16px" : "24px",
                        flexShrink: 0,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                    }}
                >
                    <motion.img
                        src={photo}
                        alt={t("student.about")}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        whileHover={{ scale: 1.05 }}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: isMobile ? "16px" : "24px",
                        }}
                    />
                </motion.div>

                {/* === INFO SECTION === */}
                <div style={{ marginLeft: isMobile ? "0" : "40px", marginTop: isMobile ? "20px" : "45px", width: isMobile ? "100%" : "auto" }}>
                    {/* === NAME === */}
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{
                            fontSize: isMobile ? "40px" : "70px",
                            lineHeight: isMobile ? "46px" : "80px",
                            fontWeight: 700,
                            margin: 0,
                            display: "flex",
                            flexDirection: "column",
                            textAlign: isMobile ? "center" : "left",
                        }}
                    >
                        <motion.span variants={fadeInUp} custom={1}>
              <span style={{ color: "var(--color-orange)", display: "inline-block" }}>
                {firstName}
              </span>
                        </motion.span>
                        <motion.span variants={fadeInUp} custom={2}>
                            <span style={{ color: "#fff", display: "inline-block" }}>{lastName}</span>
                        </motion.span>
                    </motion.h2>

                    {/* === INFO LISTS === */}
                    <motion.div
                        variants={fadeInUp}
                        custom={3}
                        style={{
                            display: "flex",
                            marginTop: isMobile ? "18px" : "45px",
                            marginLeft: isMobile ? "0" : "60px",
                            whiteSpace: isMobile ? "normal" : "nowrap",
                            flexDirection: isMobile ? "column" : "row",
                            gap: isMobile ? "16px" : "0",
                        }}
                    >
                        {/* LEFT COLUMN */}
                        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                            {infoLeft.map(([label, value], index) => (
                                <motion.li
                                    key={index}
                                    variants={fadeInUp}
                                    custom={4 + index}
                                    style={{
                                        lineHeight: isMobile ? "28px" : "44px",
                                        display: "flex",
                                        alignItems: isMobile ? "flex-start" : "center",
                                        gap: isMobile ? "8px" : "12px",
                                        fontSize: isMobile ? "13px" : "16px",
                                        whiteSpace: "nowrap",
                                        marginLeft: isMobile ? (index % 2 === 0 ? "0" : "14px") : "0",
                                    }}
                                >
                                    {/* Orange Bullet - centered vertically */}
                                    <span
                                        style={{
                                            width: isMobile ? "8px" : "10px",
                                            height: isMobile ? "8px" : "10px",
                                            borderRadius: "50%",
                                            backgroundColor: "var(--color-orange)",
                                            flexShrink: 0,
                                            marginLeft: isMobile ? "0" : "5px",
                                            marginTop: isMobile ? "10px" : "0",
                                        }}
                                    />
                                    <span style={{ color: "rgba(255,255,255,0.7)", marginRight: "7px" }}>
                    {label}
                  </span>
                                    <span style={{ fontWeight: 500, color: "#fff" }}>{value}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* RIGHT COLUMN */}
                        <ul
                            style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                marginLeft: isMobile ? "0" : "75px",
                            }}
                        >
                            {infoRight.map(([label, value], index) => (
                                <motion.li
                                    key={index}
                                    variants={fadeInUp}
                                    custom={8 + index}
                                    style={{
                                        lineHeight: isMobile ? "28px" : "44px",
                                        display: "flex",
                                        alignItems: isMobile ? "flex-start" : "center",
                                        gap: isMobile ? "8px" : "12px",
                                        fontSize: isMobile ? "13px" : "16px",
                                        whiteSpace: "nowrap",
                                        marginLeft: isMobile ? (index % 2 === 0 ? "14px" : "0") : "0",
                                    }}
                                >
                                    {/* Orange Bullet - centered vertically */}
                                    <span
                                        style={{
                                            width: isMobile ? "8px" : "10px",
                                            height: isMobile ? "8px" : "10px",
                                            borderRadius: "50%",
                                            backgroundColor: "var(--color-orange)",
                                            flexShrink: 0,
                                            marginLeft: isMobile ? "0" : "5px",
                                            marginTop: isMobile ? "10px" : "0",
                                        }}
                                    />
                                    <span style={{ color: "rgba(255,255,255,0.7)", marginRight: "7px" }}>
                    {label}
                  </span>
                                    <span style={{ fontWeight: 500, color: "#fff" }}>{value}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
