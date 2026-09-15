"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { HeartIcon } from "@/components/ui/icons/heart-icon";
import type { CurrentUser } from "@/lib/auth/user";
import { hasPermission } from "@/lib/permissions";

function MessageIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-5"><path d="M4 5.5h16v11H9l-5 3v-14Z" /></svg>;
}

const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/messages", label: "Messagerie" },
    { href: "/favorites", label: "Favoris" },
] as const;

export function SiteHeader({ user }: { user: CurrentUser | null }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const role = user?.role ?? null;
    const addHref = role === null ? "/login" : "/properties/new";
    const showAdd = role === null || hasPermission(role, "manageProperties");

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };
        const onPointerDown = (event: PointerEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [open]);

    return (
        <header className="relative z-10 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.025)] lg:bg-transparent lg:pt-12 lg:shadow-none">
            <div ref={menuRef} className="mx-auto w-full max-w-234 bg-white lg:rounded-xl lg:shadow-[0_8px_20px_rgba(0,0,0,0.035)]">
                <div className="flex h-23.5 items-center justify-between px-4 lg:grid lg:h-17 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
                    <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
                        {navLinks.slice(0, 2).map(({ href, label }) => <Link key={href} href={href} className="whitespace-nowrap text-[17px] hover:text-[#9b381e]">{label}</Link>)}
                    </nav>
                    <Link href="/" aria-label="Kasa, accueil" className="inline-flex items-center lg:justify-self-center">
                        <Image src="/images/logo.svg" alt="" width={55} height={64} className="h-14.5 w-auto lg:hidden" priority />
                        <Image src="/images/logo-name.svg" alt="" width={114} height={41} className="hidden h-12.5 w-auto lg:block" priority />
                    </Link>
                    <div className="hidden items-center justify-end gap-4 lg:flex">
                        {showAdd && <Link href={addHref} className="whitespace-nowrap text-[#9b381e] hover:underline">+Ajouter un logement</Link>}
                        <Link href="/favorites" aria-label="Favoris" className="text-[#9b381e] hover:scale-110"><HeartIcon /></Link>
                        <Link href="/messages" aria-label="Messagerie" className="text-[#9b381e] hover:scale-110"><MessageIcon /></Link>
                        {user && <form action={logoutAction}><button type="submit" className="whitespace-nowrap text-sm text-[#9b381e] hover:underline">Déconnexion</button></form>}
                    </div>
                    <button
                        ref={toggleRef}
                        type="button"
                        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={open}
                        aria-controls="mobile-navigation"
                        className="flex size-12 items-center justify-center rounded-md text-[#565656] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b381e] lg:hidden hover:cursor-pointer"
                        onClick={() => setOpen((current) => !current)}
                    >
                        {open ? <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="size-9"><path d="M5 5 27 27M27 5 5 27" /></svg> : <svg width="46" height="46" viewBox="0 0 46 46" fill="none"><path d="M15.7714 14.3378C15.7714 13.546 16.4134 12.9041 17.2052 12.9041H35.8443C36.6361 12.9041 37.2781 13.546 37.2781 14.3378C37.2781 15.1297 36.6361 15.7716 35.8443 15.7716H17.2052C16.4134 15.7716 15.7714 15.1296 15.7714 14.3378ZM35.8443 21.5067H10.0363C9.24449 21.5067 8.60254 22.1487 8.60254 22.9405C8.60254 23.7323 9.24449 24.3743 10.0363 24.3743H35.8443C36.6361 24.3743 37.2781 23.7323 37.2781 22.9405C37.2781 22.1487 36.6361 21.5067 35.8443 21.5067ZM35.8443 30.1094H22.9403C22.1485 30.1094 21.5065 30.7513 21.5065 31.5432C21.5065 32.3349 22.1485 32.9769 22.9403 32.9769H35.8443C36.6361 32.9769 37.2781 32.3349 37.2781 31.5432C37.2781 30.7513 36.6361 30.1094 35.8443 30.1094Z" fill="currentColor" /></svg>}
                    </button>
                </div>
                {open && (
                    <nav id="mobile-navigation" aria-label="Navigation mobile" className="px-4 pb-6 lg:hidden">
                        {navLinks.map(({ href, label }) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-[#efefef] py-6 text-2xl hover:text-[#9b381e]">{label}</Link>)}
                        {showAdd && <Link href={addHref} onClick={() => setOpen(false)} className="mt-6 inline-flex min-w-52 justify-center rounded-lg bg-[#97391f] px-5 py-2 text-white hover:bg-[#7d2e18]">Ajouter un logement</Link>}
                        {user && <form action={logoutAction} className="mt-6"><button type="submit" className="text-[#97391f] hover:underline">Déconnexion</button></form>}
                    </nav>
                )}
            </div>
        </header>
    );
}
