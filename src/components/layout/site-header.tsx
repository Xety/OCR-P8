"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/auth/user";
import { hasPermission } from "@/lib/permissions";

function HeartIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-5"><path d="M20.8 8.4c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" /></svg>;
}

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
                        <Image src="/images/logo-name.svg" alt="" width={140} height={50} className="hidden h-12.5 w-auto lg:block" priority />
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
                        className="flex size-12 items-center justify-center rounded-md text-[#34383a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b381e] lg:hidden"
                        onClick={() => setOpen((current) => !current)}
                    >
                        {open ? <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="size-9"><path d="M5 5 27 27M27 5 5 27" /></svg> : <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" aria-hidden="true" className="size-9"><path d="M4 8h24M10 16h18M4 24h24" /></svg>}
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
