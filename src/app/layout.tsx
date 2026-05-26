import "./globals.css";
import Providers from "./providers";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Mr. Nutrition",
    description: "Nutrition Academy Platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
