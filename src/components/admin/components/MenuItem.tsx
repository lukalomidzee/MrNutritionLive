import { Box } from "@mui/material";
import { LucideProps } from "lucide-react";
import React from "react";

interface MenuItemProps {
  id: string;
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  isActive: boolean;
  setActive: () => void;
}

export default function MenuItem(props: Readonly<MenuItemProps>) {
  const IconComponent = props.icon;
  return (
    <Box
      key={props.id}
      sx={{
        width: "80%",
        height: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 2,
        borderRadius: 1,
        paddingX: 2,
        boxSizing: "border-box",
        backgroundColor: props.isActive ? "#EFF6FF" : "#FFFFFF",
        color: props.isActive ? "#1D4ED8" : "#374151",
        "&:hover": {
          backgroundColor: "#F3F4F6",
          cursor: "pointer",
        },
        transition: "0.2s ease",
        fontSize: "1rem",
      }}
      onClick={props.setActive}
    >
      <IconComponent />
      <Box>{props.title}</Box>
    </Box>
  );
}
