import React from "react";
import { Box } from "@mui/material";
import CoursesClient from "./CoursesClient";

const Courses: React.FC = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", px: 2, py: 6 }}>
            <CoursesClient />
        </Box>
    );
};

export default Courses;
