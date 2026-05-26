"use client";

import { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";
import { User } from "oidc-client-ts";
import { getUserManager } from "./authService";
import { STATIC_DEMO_ENABLED } from "@/lib/staticDemo";

type RoleClaim = string | string[];

export interface IAuthContext {
    user: User | null;
    login: () => Promise<void> | void;
    logout: () => Promise<void> | void;
    isAuthenticated: boolean;
    roles: string[];
    isAdmin: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const staticDemo = STATIC_DEMO_ENABLED;

    useEffect(() => {
        if (staticDemo) {
            setUser(null);
            return;
        }

        const um = getUserManager();

        const loadUser = async () => {
            const storedUser = await um.getUser();
            setUser(storedUser);
        };

        loadUser();

        const userLoaded = (u: User) => setUser(u);
        const userUnloaded = () => setUser(null);
        const userSignedOut = () => setUser(null);

        um.events.addUserLoaded(userLoaded);
        um.events.addUserUnloaded(userUnloaded);
        um.events.addUserSignedOut(userSignedOut);

        return () => {
            um.events.removeUserLoaded(userLoaded);
            um.events.removeUserUnloaded(userUnloaded);
            um.events.removeUserSignedOut(userSignedOut);
        };
    }, [staticDemo]);

    const login = async () => {
        if (staticDemo) return;
        try {
            await getUserManager().signinRedirect();
        } catch (error) {
            console.error("OIDC sign-in redirect failed", error);
            const fallbackLoginUrl = process.env.NEXT_PUBLIC_IDENTITY_SERVER_LOGIN;
            if (typeof window !== "undefined" && fallbackLoginUrl) {
                window.location.href = fallbackLoginUrl;
            }
        }
    };

    const logout = async () => {
        if (staticDemo) return;
        try {
            await getUserManager().signoutRedirect();
        } catch (error) {
            console.error("OIDC sign-out redirect failed", error);
            const fallbackLogoutUrl = process.env.NEXT_PUBLIC_IDENTITY_SERVER_LOGOUT;
            if (typeof window !== "undefined" && fallbackLogoutUrl) {
                window.location.href = fallbackLogoutUrl;
            }
        } finally {
            setUser(null);
        }
    };

    const roles = useMemo(() => extractRoles(user), [user]);
    const isAuthenticated = !!user;
    const isAdmin = roles.includes("admin");

    const authValue: IAuthContext = {
        user,
        login,
        logout,
        isAuthenticated,
        roles,
        isAdmin,
    };

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

// Keep your role extraction helper (typed)
function extractRoles(user: User | null): string[] {
    if (!user) return [];
    const p = user.profile as Record<string, unknown>;

    const toStrings = (v: unknown): string[] => {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
        if (typeof v === "string") return [v];
        return [];
    };

    const direct = [
        ...toStrings(p.role as RoleClaim),
        ...toStrings(p.roles as RoleClaim),
        ...toStrings(p.groups as RoleClaim),
    ];

    if (direct.length) return direct.map((r) => r.toLowerCase());

    const realmAccess = p.realm_access as { roles?: string[] } | undefined;
    if (realmAccess?.roles?.length) return realmAccess.roles.map((r) => r.toLowerCase());

    return [];
}
