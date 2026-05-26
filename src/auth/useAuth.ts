"use client";
import { useContext } from "react";
import { AuthContext, IAuthContext } from "./AuthContext";

export default function useAuth(): IAuthContext {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
