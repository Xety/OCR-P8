import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="text-[120px] leading-none font-extrabold tracking-tight text-(--brand)">
                404<span className="sr-only"> — Page introuvable</span>
            </h1>
            <p className="mt-7 max-w-100 text-lg leading-6">
                Il semble que la page que vous cherchez ait pris des vacances... ou n’ait jamais existé.
            </p>
            <nav aria-label="Quitter la page introuvable" className="mt-12 flex flex-col gap-4">
                <Button href="/" className="inline-flex w-59 justify-center leading-5">Accueil</Button>
                <Button href="/properties" className="inline-flex w-59 justify-center leading-5">Logements</Button>
            </nav>
        </main>
    );
}
