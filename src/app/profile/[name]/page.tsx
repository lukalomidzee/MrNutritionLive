"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, Box, Button, Chip, Divider, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useAuth from "@/auth/useAuth";
import profile_cover from "../../../../public/images/poster/poster.jpg";

type Claims = Record<string, unknown>;

type BackendUserInfo = {
    name?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    preferred_username?: string;
    sub?: string;
};

function getStringClaim(claims: Claims | null, keys: string[]): string {
    if (!claims) return "";
    for (const key of keys) {
        const value = claims[key];
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const normalized = fullName.trim();
    if (!normalized) return { firstName: "", lastName: "" };
    const parts = normalized.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user, isAuthenticated, login } = useAuth();
    const params = useParams<{ name?: string }>();
    const routeName = Array.isArray(params?.name) ? params.name[0] : params?.name;

    const [backendClaims, setBackendClaims] = useState<BackendUserInfo | null>(null);
    const [loadingBackendProfile, setLoadingBackendProfile] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadUserInfo = async () => {
            if (!user?.access_token) return;

            const identityBase =
                process.env.NEXT_PUBLIC_IDENTITY_SERVER_BASE ??
                process.env.NEXT_PUBLIC_IDENTITY_URL ??
                "https://localhost:7160";

            const normalizedBase = identityBase.replace(/\/+$/, "");
            const tried: Array<{ endpoint: string; status: number | "network" }> = [];

            try {
                setLoadingBackendProfile(true);

                const endpoints: string[] = [];
                try {
                    const discoveryResponse = await fetch(`${normalizedBase}/.well-known/openid-configuration`);
                    if (discoveryResponse.ok) {
                        const discovery = (await discoveryResponse.json()) as { userinfo_endpoint?: string };
                        if (discovery.userinfo_endpoint) {
                            endpoints.push(discovery.userinfo_endpoint);
                        }
                    }
                } catch {
                    // Discovery is optional fallback logic here.
                }

                endpoints.push(`${normalizedBase}/connect/userinfo`);

                for (const endpoint of [...new Set(endpoints)]) {
                    try {
                        const response = await fetch(endpoint, {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${user.access_token}`,
                            },
                        });

                        if (!response.ok) {
                            tried.push({ endpoint, status: response.status });
                            continue;
                        }

                        const payload = (await response.json()) as BackendUserInfo;
                        if (!cancelled) {
                            setBackendClaims(payload);
                        }
                        return;
                    } catch {
                        tried.push({ endpoint, status: "network" });
                    }
                }

                if (!cancelled) {
                    setBackendClaims(null);
                }
            } catch (error) {
                console.error("Failed to load profile from backend userinfo endpoints", error);
            } finally {
                if (tried.length > 0) {
                    console.warn("No userinfo endpoint succeeded; using token claims fallback.", tried);
                }
                if (!cancelled) {
                    setLoadingBackendProfile(false);
                }
            }
        };

        if (isAuthenticated) {
            loadUserInfo();
        } else {
            setBackendClaims(null);
            setLoadingBackendProfile(false);
        }

        return () => {
            cancelled = true;
        };
    }, [user?.access_token, isAuthenticated]);

    const tokenClaims = (user?.profile as Claims | undefined) ?? null;

    const profile = useMemo(() => {
        const claims = (backendClaims as Claims | null) ?? tokenClaims;

        const fullNameFromClaims = getStringClaim(claims, ["name", "preferred_username"]);
        const email =
            getStringClaim(claims, ["email", "preferred_username"]) ||
            getStringClaim(tokenClaims, ["email", "preferred_username"]);

        let firstName = getStringClaim(claims, ["given_name", "first_name", "firstName"]);
        let lastName = getStringClaim(claims, ["family_name", "last_name", "lastName"]);

        if (!firstName && !lastName && fullNameFromClaims) {
            const split = splitName(fullNameFromClaims);
            firstName = split.firstName;
            lastName = split.lastName;
        }

        if (!firstName && routeName) {
            const split = splitName(routeName.replace(/[._-]/g, " "));
            firstName = split.firstName;
            if (!lastName) lastName = split.lastName;
        }

        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || fullNameFromClaims || routeName || "User";
        const username = getStringClaim(claims, ["preferred_username", "username", "sub"]) || "unknown-user";

        return {
            fullName,
            firstName: firstName || "N/A",
            lastName: lastName || "N/A",
            email: email || "N/A",
            username,
            avatarLetter: (firstName || fullName || "U").charAt(0).toUpperCase(),
        };
    }, [backendClaims, tokenClaims, routeName]);

    return (
        <Box sx={{ bgcolor: "var(--color-white)", minHeight: "100vh" }}>
            <Toolbar />
            <Box
                sx={{
                    height: { xs: 230, md: 340 },
                    background: `linear-gradient(87deg, var(--color-orange-transparent), var(--color-green-transparent)), url('${profile_cover.src}') center/cover no-repeat`,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    px: { xs: 2, md: 8 },
                    py: { xs: 4, md: 8 },
                    my: 2,
                    borderBottomLeftRadius: "2.25rem",
                    borderBottomRightRadius: "2.25rem",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "relative", zIndex: 2 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: "var(--color-white)",
                            fontWeight: 700,
                            letterSpacing: 2,
                            mb: 1,
                            fontSize: { xs: 28, md: 40 },
                            textShadow: "0 4px 24px var(--color-black)",
                        }}
                    >
                        {t("hello")}, {profile.firstName}!
                    </Typography>
                    <Chip
                        label={
                            loadingBackendProfile
                                ? "Syncing with backend..."
                                : backendClaims
                                  ? "Profile synced from backend"
                                  : "Using token claims fallback"
                        }
                        sx={{ bgcolor: "var(--color-yellow)", color: "var(--color-black)", fontWeight: 700 }}
                    />
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(18,50,87,0.58)",
                        zIndex: 1,
                        borderBottomLeftRadius: "2.25rem",
                        borderBottomRightRadius: "2.25rem",
                    }}
                />
            </Box>

            {!isAuthenticated && (
                <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
                    <Paper sx={{ p: 4, borderRadius: "1.5rem", textAlign: "center" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Please sign in to view your profile.
                        </Typography>
                        <Button variant="contained" onClick={login}>
                            {t("signIn") || "Sign In"}
                        </Button>
                    </Paper>
                </Box>
            )}

            {isAuthenticated && (
                <Box sx={{ px: { xs: 2, md: 6 }, mt: -10, mb: 8, zIndex: 10, position: "relative" }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ width: "100%", alignItems: "stretch" }}>
                        <Box sx={{ flex: { md: 4, xs: "none" } }}>
                            <Paper
                                elevation={6}
                                sx={{
                                    p: 3,
                                    borderRadius: "2rem",
                                    background: "linear-gradient(140deg, var(--color-green) 0%, var(--color-blue) 100%)",
                                    color: "var(--color-white)",
                                    boxShadow: "0 12px 40px rgba(18,50,87,0.35)",
                                    height: "100%",
                                }}
                            >
                                <Stack alignItems="center" spacing={1.5} mb={2}>
                                    <Avatar
                                        alt={profile.fullName}
                                        sx={{
                                            width: 110,
                                            height: 110,
                                            border: "5px solid var(--color-orange)",
                                            boxShadow: "0 4px 24px var(--color-orange-transparent)",
                                            bgcolor: "var(--color-white)",
                                            color: "var(--color-black)",
                                            fontSize: 42,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {profile.avatarLetter}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {profile.fullName}
                                    </Typography>
                                    <Typography sx={{ color: "var(--color-yellow)", fontSize: 14 }}>
                                        @{profile.username}
                                    </Typography>
                                </Stack>

                                <Divider sx={{ borderColor: "var(--color-white)", opacity: 0.2, mb: 2 }} />
                                <Stack spacing={1}>
                                    <Typography sx={{ opacity: 0.8, fontSize: 13 }}>Status</Typography>
                                    <Typography sx={{ fontWeight: 700, color: "var(--color-yellow)" }}>
                                        {loadingBackendProfile ? "Loading backend profile..." : "Connected"}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Box>

                        <Box sx={{ flex: { md: 8, xs: "none" } }}>
                            <Paper
                                elevation={4}
                                sx={{
                                    p: { xs: 2, md: 4 },
                                    borderRadius: "2rem",
                                    bgcolor: "var(--color-white-white)",
                                    boxShadow: "0 8px 28px rgba(13,13,11,0.12)",
                                    height: "100%",
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--color-blue)" }}>
                                        {t("myAccount")}
                                    </Typography>
                                    <Chip
                                        label={backendClaims ? "Backend userinfo" : "Token claims fallback"}
                                        sx={{ bgcolor: "var(--color-orange)", color: "var(--color-black)", fontWeight: 700 }}
                                    />
                                </Stack>
                                <Divider sx={{ mb: 3 }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--color-gray)", mb: 2 }}>
                                    User Information
                                </Typography>
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    <Box flex={1}>
                                        <Typography sx={{ color: "var(--color-gray)", fontSize: 13 }}>First name</Typography>
                                        <Typography sx={{ color: "var(--color-black)", fontWeight: 600 }}>{profile.firstName}</Typography>
                                    </Box>
                                    <Box flex={1}>
                                        <Typography sx={{ color: "var(--color-gray)", fontSize: 13 }}>Last name</Typography>
                                        <Typography sx={{ color: "var(--color-black)", fontWeight: 600 }}>{profile.lastName}</Typography>
                                    </Box>
                                    <Box flex={1}>
                                        <Typography sx={{ color: "var(--color-gray)", fontSize: 13 }}>Email</Typography>
                                        <Typography sx={{ color: "var(--color-black)", fontWeight: 600, overflowWrap: "anywhere" }}>
                                            {profile.email}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--color-gray)", mb: 2 }}>
                                    Identity Information
                                </Typography>
                                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                    <Box flex={1}>
                                        <Typography sx={{ color: "var(--color-gray)", fontSize: 13 }}>Display name</Typography>
                                        <Typography sx={{ color: "var(--color-black)", fontWeight: 600 }}>{profile.fullName}</Typography>
                                    </Box>
                                    <Box flex={1}>
                                        <Typography sx={{ color: "var(--color-gray)", fontSize: 13 }}>Username</Typography>
                                        <Typography sx={{ color: "var(--color-black)", fontWeight: 600 }}>{profile.username}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </Stack>
                </Box>
            )}
            <Toolbar />
        </Box>
    );
}
