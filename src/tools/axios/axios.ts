"use client";

import axios from "axios";
import { getUserManager } from "@/auth/authService";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
    async (config) => {
        const userManager = getUserManager();

        let user = await userManager.getUser();

        if (user?.expired) {
            try {
                user = await userManager.signinSilent();
            } catch (error) {
                console.error("Token refresh failed before API call", error);
                await userManager.signoutRedirect();
                return Promise.reject(error);
            }
        }

        if (user?.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("401 Unauthorized detected, logging out user");
            await getUserManager().signoutRedirect();
        }
        return Promise.reject(error);
    }
);

export default api;
