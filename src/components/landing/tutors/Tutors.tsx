import { Box } from "@mui/material";
import TutorsClient from "./TutorsClient";

const Tutors = () => {
    return (
        <Box
            sx={{
                minHeight: "600px",
                scrollSnapAlign: "start",
                px: 2,
                py: 6,
            }}
        >
            <TutorsClient />
        </Box>
    );
};

export default Tutors;
