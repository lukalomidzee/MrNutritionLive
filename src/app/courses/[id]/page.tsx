import { Box } from "@mui/material";
import CourseDetailPageClient from "@/components/course-details/CourseDetailPageClient";
import { mockCourses } from "@/components/backend/mockData";

export function generateStaticParams() {
    return mockCourses.map((course) => ({ id: course.id }));
}

export default function CourseDetailPage() {
    return (
        <Box sx={{ backgroundColor: "#F6F5E3" }}>
            <CourseDetailPageClient />
        </Box>
    );
}
