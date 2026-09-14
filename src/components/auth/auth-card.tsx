import type { ReactNode } from "react";

export function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <main className="flex flex-1 items-center justify-center px-4.5 py-12 md:py-24">
            <section className="w-full max-w-222 rounded-xl border border-[#F5F5F5] bg-white px-4 py-10 sm:px-12 md:px-20 md:py-24">
                <div className="mx-auto max-w-152.5 text-center">
                    <h1 className="text-[28px] leading-tight font-bold text-(--brand) sm:text-[40px]">{title}</h1>
                    <p className="mt-4 text-base leading-6 sm:text-lg">{description}</p>
                </div>
                {children}
            </section>
        </main>
    );
}
