import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io', // You can specify a valid hostname here
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;