import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "localhost",
                port: "7179",
                pathname: "/media/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5001",
                pathname: "/media/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5001/api/:path*", // backend target
            },
        ];
    },
};

export default nextConfig;
