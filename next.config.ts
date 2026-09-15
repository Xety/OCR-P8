import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Next bloque par défaut les images provenant de sources externes pour des raisons de sécurité. En ajoutant ces URL à la configuration, on permet à Next.js de les charger et de les afficher correctement dans l'application.
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "s3-eu-west-1.amazonaws.com",
                pathname: "/course.oc-static.com/projects/front-end-kasa-project/**",
            },
        ],
    },
};

export default nextConfig;
