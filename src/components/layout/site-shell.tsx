import type { ReactNode } from "react";
import type { CurrentUser } from "@/lib/auth/user";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteShell({ children, user }: { children: ReactNode; user: CurrentUser | null }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <SiteHeader user={user} />
            {children}
            <SiteFooter />
        </div>
    );
}
