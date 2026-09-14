import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { getCurrentUser } from "@/lib/auth/user";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kasa",
    description: "Des séjours uniques, à partager.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const user = await getCurrentUser();
    return (
        <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
            <body>
                <SiteShell user={user}>{children}</SiteShell>
            </body>
        </html>
    );
}
