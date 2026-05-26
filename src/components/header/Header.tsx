import { AppBar, Box } from "@mui/material";
import Link from "next/link";
import HeaderShellClient from "./HeaderShellClient";
import HeaderClient from "./HeaderClient";
import { sitePath } from "@/lib/sitePath";

export default function Header() {
    return (
        <HeaderShellClient>
            <AppBar
                sx={{
                    top: 0,
                    left: 0,
                    height: { xs: 72, sm: 84, md: 100 },
                    backgroundColor: "var(--color-white)",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    boxShadow: "none",
                    px: { xs: 1, sm: 1.5, md: 2 },
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Box
                        component="img"
                        src={sitePath("/images/logos/logo_black.png")}
                        alt="Logo"
                        sx={{
                            p: { xs: 1, sm: 1.5, md: 2 },
                            cursor: "pointer",
                            display: "block",
                            width: "auto",
                            maxHeight: { xs: 40, sm: 50, md: 60 },
                        }}
                    />
                </Link>

                {/* Client-only features */}
                <HeaderClient />
            </AppBar>
        </HeaderShellClient>
    );
}
