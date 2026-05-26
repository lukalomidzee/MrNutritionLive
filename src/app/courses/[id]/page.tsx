import { Box } from "@mui/material";
import CourseDetailPageClient from "@/components/course-details/CourseDetailPageClient";

export function generateStaticParams() {
    return [
        { id: "nutrition-coach" },
        { id: "meal-planning" },
    ];
}

export default function CourseDetailPage() {
    return (
        <Box sx={{ backgroundColor: "#F6F5E3" }}>
            <CourseDetailPageClient />
        </Box>
    );
}
