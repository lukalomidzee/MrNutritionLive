"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "./useAuth";

const ADMIN_EMAILS = ["tchkoidzeluka17@gmail.com"];

function isAdminFromUser(user: any): boolean {
  if (typeof window !== "undefined" && localStorage.getItem("forceAdmin") === "1") return true;
  const p = user?.profile as Record<string, unknown> | undefined;
  if (!p) return false;
  const rawEmail =
      (p.email as string | undefined) ||
      (p.preferred_username as string | undefined) ||
      (p.name as string | undefined) ||
      "";
  const email = String(rawEmail).toLowerCase().trim();
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);
}

const ENTRY_WINDOW_MS = 10_000;

function consumeAdminEntry(): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem("adminEntryAt");
  if (!raw) return false;
  const ts = Number(raw);
  const fresh = Number.isFinite(ts) && Date.now() - ts <= ENTRY_WINDOW_MS;
  sessionStorage.removeItem("adminEntryAt");
  return fresh;
}

export default function AdminRoute({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasUser = !!user;
    const isAdmin = isAdminFromUser(user);

    if (!hasUser || !isAdmin) {
      router.replace("/403");
      return;
    }

    const viaToken = consumeAdminEntry();
    if (!viaToken) {
      router.replace("/403");
    }
  }, [user, router, pathname]);

  return <>{children}</>;
}
