"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { getUserManager } from "@/auth/authService";

export default function Callback() {
    const router = useRouter();
    const callbackHandled = useRef(false);

    useEffect(() => {
        if (callbackHandled.current) return;

        const userManager = getUserManager();

        userManager
            .signinRedirectCallback()
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                console.error(error);
                userManager.signoutRedirect();
            });

        callbackHandled.current = true;
    }, [router]);

    return <Loader />;
}
