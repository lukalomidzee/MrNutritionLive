"use client";

import React, {useEffect, useMemo, useState} from "react";
import {Box, Typography} from "@mui/material";
import FilterBar from "./FilterBar";
import StudentGrid from "./StudentsGrid";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import {StudentDTO} from "@/components/backend/types";
import {useStudents} from "@/components/backend/hooks";

type EducationFilterOption = {
    value: string;
    label: string;
};

type EducationRecordView = {
    educationTypeId: string;
    educationTypeName?: string;
    educationTypeNameGeo?: string;
    title?: string;
    titleGeo?: string;
};

const StudentsSection: React.FC = () => {
    const {t, i18n} = useTranslation();

    const {items, loading, error} = useStudents();
    const allStudents: StudentDTO[] = useMemo(() => items ?? [], [items]);

    const educationOptions = useMemo<EducationFilterOption[]>(() => {
        const isGeorgian = i18n.language === "ka";
        const seen = new Set<string>();

        const dynamicOptions = allStudents
            .flatMap((student) =>
                student.educationRecords.map((record) => {
                    const education = record as unknown as EducationRecordView;
                    const label = isGeorgian
                        ? education.titleGeo || education.title
                        : education.title || education.titleGeo;

                    return {
                        value: label || "",
                        label: label || "",
                    };
                })
            )
            .filter((option) => {
                if (!option.value || seen.has(option.value)) return false;
                seen.add(option.value);
                return true;
            });

        return [{ value: "all", label: t("allStudents") }, ...dynamicOptions];
    }, [allStudents, i18n.language, t]);

    const [searchQuery, setSearchQuery] = useState("");
    const [educationFilter, setEducationFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const students: StudentDTO[] = useMemo(() => {
        const isGeorgian = i18n.language === "ka";
        const q = searchQuery.trim().toLowerCase();

        return allStudents
            .filter((student) => {
                const first = (isGeorgian ? student.firstNameGeo : student.firstName).toLowerCase();
                const last = (isGeorgian ? student.lastNameGeo : student.lastName).toLowerCase();

                const matchesQuery = !q || first.includes(q) || last.includes(q);

                const matchesEducation =
                    educationFilter === "all" ||
                    student.educationRecords.some((record) => {
                        const education = record as unknown as EducationRecordView;
                        const value = isGeorgian
                            ? education.titleGeo || education.title
                            : education.title || education.titleGeo;

                        return value === educationFilter;
                    });

                return matchesQuery && matchesEducation;
            })
            .sort((a, b) => Number(b.academyFavourite) - Number(a.academyFavourite));
    }, [allStudents, searchQuery, educationFilter, i18n.language]);

    const totalStudents = students.length;
    const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize));

    useEffect(() => {
        setPage(1);
    }, [searchQuery, educationFilter]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const pagedStudents = useMemo(() => {
        const start = (page - 1) * pageSize;
        return students.slice(start, start + pageSize);
    }, [students, page]);

    return (
        <motion.div
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: 0.01}}
            transition={{duration: 0.6, ease: "easeOut"}}
        >
            <Box
                sx={{
                    backgroundColor: "var(--color-white)",
                    px: {xs: 2, md: 4},
                    pb: 6,
                    boxSizing: "border-box",
                    maxWidth: "100%",
                    overflowX: "hidden",
                }}
            >
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 3 }}>
                    {t("meetOurStudents")}
                </Typography>

                <FilterBar
                    searchFilter={searchQuery}
                    onSearchFilter={setSearchQuery}
                    educationFilter={educationFilter}
                    onEducationFilter={setEducationFilter}
                    educationOptions={educationOptions}
                />

                {loading && <Typography>{t("loading")}...</Typography>}
                {error && <Typography color="red">{error.message}</Typography>}
                {!loading && !error && (
                    <StudentGrid
                        students={pagedStudents}
                        totalStudents={totalStudents}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </Box>
        </motion.div>
    );
};

export default StudentsSection;
