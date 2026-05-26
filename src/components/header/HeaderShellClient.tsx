"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppBarProps } from "@mui/material/AppBar";

export default function HeaderShellClient({
                                              children,
                                          }: {
    children: React.ReactElement<AppBarProps>;
}) {
    const pathname = usePathname();
    const sticky = !pathname.startsWith("/courses");

    return React.cloneElement(children, {
        position: sticky ? "fixed" : "relative",
    });
}
