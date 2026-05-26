"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function AppShell({
                                     children,
                                 }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    const hideChrome =
        pathname.startsWith("/students/") && pathname.split("/").length === 3;

    return (
        <>
            {!hideChrome && <Header />}
            {children}
            {!hideChrome && <Footer />}
        </>
    );
}
