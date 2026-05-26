"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    Menu,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSelector from "../LanguageSelector";
import useAuth from "@/auth/useAuth";

const ADMIN_EMAILS = ["tchkoidzeluka17@gmail.com"];

function isAdminFromUser(user: any): boolean {
    if (typeof window !== "undefined" && localStorage.getItem("forceAdmin") === "1")
        return true;

    const p = user?.profile as Record<string, unknown> | undefined;
    if (!p) return false;

    const rawEmail =
        (p.email as string | undefined) ??
        (p.preferred_username as string | undefined) ??
        (p.name as string | undefined) ??
        "";

    const email = String(rawEmail).toLowerCase().trim();
    return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);
}

const navItems = [
    { label: "landingHeaderHome", to: "/" },
    { label: "landingHeaderCourses", to: "/courses" },
    { label: "landingHeaderStudents", to: "/students" },
];

const stableLabels: Record<string, string> = {
    landingHeaderHome: "Main",
    landingHeaderCourses: "Courses",
    landingHeaderStudents: "Students",
    profile: "Profile",
    adminPanel: "Admin panel",
    logout: "Logout",
    signIn: "Sign In",
};

export default function HeaderClient() {
    const { user, login, logout } = useAuth();
    const { t } = useTranslation();
    const pathname = usePathname();

    const [isHydrated, setIsHydrated] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const isAdmin = useMemo(() => isAdminFromUser(user), [user]);
    const getLabel = (key: string) => (isHydrated ? t(key) : stableLabels[key] ?? key);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);

    // ✅ Works for nested routes like /courses/123 or /students/abc
    const currentTab = navItems.findIndex((item) =>
        item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
    );
    const showIndicator = currentTab !== -1;

    const renderNavTabs = () => (
        <Tabs
            value={showIndicator ? currentTab : false}
            sx={{
                gap: 2,
                "& .MuiTabs-indicator": {
                    display: showIndicator ? "block" : "none",
                    backgroundColor: "var(--color-orange)",
                },
            }}
        >
            {navItems.map((item) => (
                <Tab
                    key={item.to}
                    label={getLabel(item.label)}
                    component={Link}
                    href={item.to}
                    sx={{
                        fontSize: 16,
                        fontFamily: "Noto Sans Georgian",
                        mx: 1,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: "bold",
                        color: "var(--color-green)",
                        "&:hover": {
                            color: "var(--color-green-transparent)",
                            backgroundColor: "transparent",
                        },
                        "&.Mui-selected": {
                            color: "var(--color-orange)",
                        },
                    }}
                />
            ))}
        </Tabs>
    );

    const renderAuthButton = (mode: "header" | "drawer" = "header") => {
        const isDrawer = mode === "drawer";

        if (user) {
            return (
                <>
                    <IconButton
                        size="medium"
                        onClick={handleMenuOpen}
                        sx={{
                            color: "var(--color-black)",
                            border: "2px solid var(--color-green)",
                            borderRadius: "50%",
                            width: 48,
                            height: 48,
                            minWidth: 48,
                            minHeight: 48,
                            p: 0,
                            aspectRatio: "1 / 1",
                            background: "var(--color-white)",
                            "&:hover": {
                                background: "var(--color-orange)",
                                color: "var(--color-white)",
                                border: "2px solid var(--color-orange)",
                            },
                        }}
                    >
                        <AccountCircle fontSize="large" />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem component={Link} href={`/profile/${user.profile?.name}`}>
                            {getLabel("profile")}
                        </MenuItem>

                        {isAdmin && (
                            <MenuItem component={Link} href="/admin">
                                {getLabel("adminPanel")}
                            </MenuItem>
                        )}

                        <MenuItem onClick={logout}>{getLabel("logout")}</MenuItem>
                    </Menu>
                </>
            );
        }

        return (
            <Button
                onClick={login}
                sx={{
                    fontWeight: "bold",
                    border: "2px solid var(--color-orange)",
                    backgroundColor: "var(--color-green)",
                    color: "var(--color-white)",
                    textTransform: "none",
                    px: isDrawer ? 2 : 4,
                    py: 1.2,
                    width: isDrawer ? "100%" : "auto",
                    fontSize: 16,
                    borderRadius: "999px",
                    "&:hover": {
                        backgroundColor: "var(--color-orange)",
                        color: "var(--color-white)",
                        border: "2px solid var(--color-orange)",
                    },
                    "&:active": {
                        backgroundColor: "var(--color-orange)",
                        color: "var(--color-white)",
                        border: "2px solid var(--color-orange)",
                    },
                }}
            >
                {getLabel("signIn")}
            </Button>
        );
    };

    return (
        <>
            <Toolbar
                sx={{
                    display: { xs: "none", md: "flex" },
                    ml: { md: 2, lg: 6, xl: 10 },
                    mr: 0,
                    p: 0,
                    minWidth: 0,
                }}
            >
                    <Stack direction="row" spacing={3} alignItems="center">
                        {renderNavTabs()}
                        {renderAuthButton("header")}
                        <LanguageSelector />
                    </Stack>
                </Toolbar>

            <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { xs: "inline-flex", md: "none" }, ml: "auto" }}
            >
                    <MenuIcon fontSize="large" />
                </IconButton>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250, p: 2 }}>
                    <List>
                        {navItems.map((item) => (
                            <ListItemButton
                                key={item.to}
                                component={Link}
                                href={item.to}
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    fontFamily: "Noto Sans Georgian",
                                    textTransform: "none",
                                    color:
                                        (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to))
                                            ? "var(--color-orange)"
                                            : "var(--color-green)",
                                    "&:hover": {
                                        color:
                                            (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to))
                                                ? "var(--color-orange)"
                                                : "var(--color-green-transparent)",
                                    },
                                }}
                            >
                                {getLabel(item.label)}
                            </ListItemButton>
                        ))}

                        <Box sx={{ m: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                            {renderAuthButton("drawer")}
                            <LanguageSelector />
                        </Box>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
