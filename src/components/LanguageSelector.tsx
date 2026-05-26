"use client";

import { Box, Button, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { sitePath } from "@/lib/sitePath";

interface LanguageObjectType {
    code: string;
    name: string;
    flag: string;
}

const LANGUAGES: LanguageObjectType[] = [
    { code: "ka", name: "ქართული", flag: sitePath("/images/flags/ge.svg") },
    { code: "en", name: "English", flag: sitePath("/images/flags/gb.svg") },
];

const STORAGE_KEY = "lang";
const DEFAULT_LANGUAGE = LANGUAGES[1];

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const [isHydrated, setIsHydrated] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        setIsHydrated(true);

        const savedLang =
            typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const languageInfo = useMemo(() => {
        if (!isHydrated) {
            return DEFAULT_LANGUAGE;
        }

        return (
            LANGUAGES.find((language) => language.code === i18n.language) ||
            DEFAULT_LANGUAGE
        );
    }, [i18n.language, isHydrated]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (language: LanguageObjectType) => {
        i18n.changeLanguage(language.code);
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, language.code);
        }
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 3,
            }}
        >
            <Button
                onClick={handleClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    width: 40,
                    height: 45,
                    color: "#28005b",
                    borderRadius: "10px",
                    border: "1px solid var(--color-green)",
                    "&:hover": { backgroundColor: "rgba(139, 85, 166, 0.1)" },
                    p: 0,
                }}
            >
                <img
                    src={languageInfo.flag}
                    alt={languageInfo.name}
                    style={{ width: 20, height: 15 }}
                />
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                disableScrollLock
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "var(--color-white)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #FFFFFF",
                    },
                }}
            >
                {LANGUAGES.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleClose(language)}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 60,
                            backgroundColor: "var(--color-white)",
                            "&:hover": { backgroundColor: "rgba(139, 85, 166, 0.2)" },
                        }}
                    >
                        <img
                            src={language.flag}
                            alt={language.name}
                            style={{ width: 20, height: 15 }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default LanguageSelector;
