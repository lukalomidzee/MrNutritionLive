"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import {
  BookOpen,
  Building2,
  LayoutList,
  ClipboardList,
  LucideProps,
  UserPen,
  Users,
  Link2,
  FileText,
  BookMarked,
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminContent from "./components/AdminContent";
import { EntityType } from "./types/admin";

export interface AdminPanelTab {
  id: EntityType;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export default function AdminPanel() {
  const tabs: AdminPanelTab[] = [
    { id: "Dictionaries", icon: BookMarked },
    { id: "Authors", icon: UserPen },
    { id: "Issuers", icon: Building2 },
    { id: "Courses", icon: BookOpen },
    { id: "Students", icon: Users },
    { id: "Enrollments", icon: ClipboardList },
    { id: "ProfileRecords", icon: FileText },
    { id: "SocialLinks", icon: Link2 },
    { id: "SiteDetails", icon: LayoutList },
  ];

  const [activeTab, setActiveTab] = useState<EntityType>("Dictionaries");

  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          mt: "100px",
        }}
      >
        <AdminSidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <AdminContent activeTab={activeTab} />
      </Box>
    </Box>
  );
}
