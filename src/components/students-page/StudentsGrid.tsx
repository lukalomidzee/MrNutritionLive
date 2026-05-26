"use client";

import { Box, Typography, Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { StudentDTO } from "@/components/backend/types";
import StudentCard from "@/components/students-page/StudentsCard";

type Props = {
    students: StudentDTO[];
    totalStudents: number;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function StudentGrid({ students, totalStudents, page, totalPages, onPageChange }: Readonly<Props>) {
    const { t } = useTranslation();
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;

    if (totalStudents === 0) {
        return (
            <Box sx={{ bgcolor: "background.paper", borderRadius: 3, p: 4, textAlign: "center" }}>
                <Typography variant="h6">{t("noStudentsFound")}</Typography>
                <Typography variant="body1">{t("tryAdjustingFilters")}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ pt: 1, minWidth: 0, maxWidth: "100%" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3.5 }}>
                {students.map((student) => (
                    <Box key={student.id} sx={{ flex: "1 1 260px", maxWidth: "300px", width: "100%" }}>
                        <StudentCard student={student} />
                    </Box>
                ))}
            </Box>

            {students.length > 0 && (
                <Box
                    sx={{
                        mt: 5,
                        p: { xs: 2, sm: 2.5 },
                        boxSizing: "border-box",
                        width: "100%",
                        maxWidth: "100%",
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.65)",
                        border: "1px solid rgba(0,88,65,0.16)",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: { xs: "center", sm: "space-between" },
                        alignItems: "center",
                        gap: 2.5,
                    }}
                >
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {t("showingStudents", { count: totalStudents })}
                    </Typography>
                    <Pagination
                        count={safeTotalPages}
                        page={safePage}
                        onChange={(_, value) => onPageChange(value)}
                        size="medium"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                borderRadius: 2,
                                fontWeight: 700,
                            },
                            "& .Mui-selected": {
                                backgroundColor: "var(--color-green) !important",
                                color: "var(--color-white)",
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
