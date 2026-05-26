"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function AppShell({
                                     children,
                                 }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    const normalizedPathname = pathname.replace(/\/+$/, "");
    const hideChrome =
        normalizedPathname.startsWith("/students/") &&
        normalizedPathname.split("/").filter(Boolean).length === 2;

    return (
        <>
            {!hideChrome && <Header />}
            {children}
            {!hideChrome && <Footer />}
        </>
    );
}
