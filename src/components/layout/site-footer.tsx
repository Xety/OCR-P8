import Image from "next/image";

export function SiteFooter() {
    return (
        <footer className="border-t border-[#f1f0f0] bg-white px-5 py-3 text-sm text-[#555a60] sm:px-12">
            <div className="mx-auto flex w-full max-w-[1640px] items-center justify-between gap-4">
                <Image src="/images/logo.svg" alt="Kasa" width={55} height={64} className="h-14 w-auto" />
                <span>© {new Date().getFullYear()} Kasa. All rights reserved</span>
            </div>
        </footer>
    );
}
