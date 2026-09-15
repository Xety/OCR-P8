import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "À propos | Kasa",
    description: "Découvrez la mission de Kasa et notre vision du voyage.",
};

export default function AboutPage() {
    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-10 pt-6 pb-24">
            <header className="mx-auto max-w-180 text-center">
                <h1 className="text-3xl font-bold text-(--brand) lg:text-[32px]">À propos</h1>
                <p className="mt-3 text-sm leading-5 lg:mt-2">
                    Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se sentir bien.
                </p>
                <p className="mt-5 text-sm leading-5 lg:mt-3">
                    Depuis notre création, nous mettons en relation des voyageurs en quête d’authenticité avec des hôtes passionnés qui aiment partager leur région et leurs bonnes adresses.
                </p>
            </header>

            <div className="relative mt-10 h-106 overflow-hidden rounded-2xl lg:mt-9 lg:h-98.5">
                <Image
                    src="/images/about/house1.png"
                    alt="Maison Kasa en bois au cœur d’un environnement arboré"
                    fill
                    priority
                    sizes="(max-width: 1023px) calc(100vw - 28px), min(92.5vw, 1776px)"
                    className="scale-[1.14] object-cover lg:scale-[1.04]"
                />
            </div>

            <section className="mt-12 grid items-start gap-x-14 gap-y-5 lg:mt-8 lg:grid-cols-[1.2fr_1fr] lg:grid-rows-[auto_1fr]">
                <div className="lg:col-start-1 lg:row-start-1 lg:translate-y-20 lg:self-end lg:pb-2">
                    <h2 className="text-lg font-bold text-(--brand)">Notre mission est simple :</h2>
                    <ol className="mt-4 list-decimal space-y-5 pl-5 text-sm leading-5 lg:space-y-4">
                        <li>Offrir une plateforme fiable et simple d’utilisation</li>
                        <li>Proposer des hébergements variés et de qualité</li>
                        <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
                    </ol>
                </div>

                <div className="relative h-105 overflow-hidden rounded-2xl lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-98.5">
                    <Image
                        src="/images/about/house2.png"
                        alt="Chalet Kasa chaleureux éclairé au crépuscule"
                        fill
                        sizes="(max-width: 1023px) calc(100vw - 28px), min(42vw, 790px)"
                        className="scale-[1.13] object-cover lg:scale-[1.06]"
                    />
                </div>

                <p className="text-lg leading-6 font-medium text-(--brand) lg:col-start-1 lg:row-start-2 lg:mt-0 lg:translate-y-16">
                    Que vous cherchiez un appartement cosy en centre-ville, une maison en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que chaque séjour devienne un souvenir inoubliable.
                </p>
            </section>
        </main>
    );
}
