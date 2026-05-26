import { Box } from "@mui/material";
import HeroSection from "@/components/students-page/HeroSection";
import StudentsSection from "@/components/students-page/StudentsSection";
import SitePageVideoSection from "@/components/site-details/SitePageVideoSection";

export default function StudentsPage() {
    return (
        <Box sx={{ width: "100%", overflowX: "clip" }}>
            <HeroSection />
            <SitePageVideoSection pageTypeName="students" />
            <StudentsSection />
        </Box>
    );
}
