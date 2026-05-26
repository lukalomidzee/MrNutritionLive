"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/auth/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.replace(`/?from=${pathname}`);
    }
  }, [user, pathname, router]);

  if (!user) return null; // prevent flash

  return <>{children}</>;
}
