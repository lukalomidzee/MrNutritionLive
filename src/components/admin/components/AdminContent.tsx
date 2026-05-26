import { Box } from "@mui/material";
import { EntityType } from "../types/admin";
import CoursesTabContainer from "../tabs/CoursesTabContainer";
import StudentsTabContainer from "../tabs/StudentsTabContainer";
import AuthorsTabContainer from "../tabs/AuthorsTabContainer";
import IssuersTabContainer from "../tabs/IssuersTabContainer";
import SiteDetailsTabContainer from "../tabs/SiteDetailsTabContainer";
import EnrollmentsTabContainer from "../tabs/EnrollmentsTabContainer";
import ProfileRecordsTabContainer from "../tabs/ProfileRecordsTabContainer";
import SocialLinksTabContainer from "../tabs/SocialLinksTabContainer";
import DictionariesTabContainer from "../tabs/DictionariesTabContainer";

interface ContentProps {
  activeTab: EntityType;
}

export default function AdminContent({ activeTab }: Readonly<ContentProps>) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 8,
        bgcolor: "#F9FAFB",
        p: 5,
        boxSizing: "border-box",
      }}
    >
      {activeTab === "Dictionaries" && <DictionariesTabContainer />}
      {activeTab === "Authors" && <AuthorsTabContainer />}
      {activeTab === "Issuers" && <IssuersTabContainer />}
      {activeTab === "Courses" && <CoursesTabContainer />}
      {activeTab === "Students" && <StudentsTabContainer />}
      {activeTab === "Enrollments" && <EnrollmentsTabContainer />}
      {activeTab === "ProfileRecords" && <ProfileRecordsTabContainer />}
      {activeTab === "SocialLinks" && <SocialLinksTabContainer />}
      {activeTab === "SiteDetails" && <SiteDetailsTabContainer />}
    </Box>
  );
}
