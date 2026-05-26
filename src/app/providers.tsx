"use client";

import {ThemeProvider} from "@mui/material";
import {AuthProvider} from "@/auth/AuthContext";
import theme from "@/app/theme";
import React from "react";
import "@/translations/i18n/client";
import AppShell from "./appshell";

export default function Providers({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <AppShell>
                    {children}
                </AppShell>
            </AuthProvider>
        </ThemeProvider>
    );
}
