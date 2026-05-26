import { Dispatch, SetStateAction } from "react";
import { Box } from "@mui/material";
import MenuItem from "./MenuItem";
import { AdminPanelTab } from "../AdminPanel";
import { EntityType } from "../types/admin";

interface SideBarProps {
  tabs: AdminPanelTab[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<EntityType>>;
}

export default function AdminSidebar(props: Readonly<SideBarProps>) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flex: 2,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 5,
        boxSizing: "border-box",
      }}
    >
      {props.tabs.map((item: AdminPanelTab) => (
        <MenuItem
          key={item.id}
          id={item.id}
          title={item.id}
          icon={item.icon}
          isActive={props.activeTab == item.id}
          setActive={() => props.setActiveTab(item.id)}
        />
      ))}
    </Box>
  );
}
