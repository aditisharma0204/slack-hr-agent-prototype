/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Demo mode: use placeholder when Convex not configured (Convex auth requires var to be set)
    env: {
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || "https://demo-disabled.convex.cloud",
    },
};

export default nextConfig;
