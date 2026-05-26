import { Box } from "@mui/material";
import CoursesPageClient from "@/components/courses-page/CoursesPageClient";

export default function CoursesPage() {
    return (
        <Box sx={{ scrollBehavior: "smooth", overflowX: "hidden" }}>
            <CoursesPageClient />
        </Box>
    );
}
