import type { Metadata } from "next";
import Image from "next/image";
import { PropertyCard } from "@/components/properties/property-card";
import { getProperties } from "@/lib/properties/properties";
import type { PropertySummary } from "@/lib/properties/validation";

export const metadata: Metadata = {
    title: "Accueil | Kasa",
    description: "Découvrez une sélection de logements chaleureux pour votre prochain séjour.",
};

const steps = [
    {
        title: "Recherchez",
        description: "Entrez votre destination, vos dates et laissez Kasa faire le reste",
    },
    {
        title: "Réservez",
        description: "Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés.",
    },
    {
        title: "Vivez l’expérience",
        description: "Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.",
    },
] as const;

export default async function HomePage() {
    let properties: PropertySummary[] = [];
    let loadingError = false;

    try {
        properties = (await getProperties()).slice(0, 12);
    } catch {
        loadingError = true;
    }

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-3.5 py-10">
            <header className="mx-auto max-w-5xl text-center">
                <h1 className="text-[32px] leading-9 font-bold text-(--brand)">
                    Chez vous, partout et ailleurs
                </h1>
                <p className="mx-auto mt-3 max-w-4xl text-sm leading-5 lg:mt-2">
                    Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec soin par nos hôtes.
                </p>
            </header>

            <div className="relative mt-8 h-93.5 overflow-hidden rounded-2xl lg:mt-10 lg:h-auto lg:aspect-[2.44/1]">
                <Image
                    src="/images/home/hero.png"
                    alt="Maison de vacances moderne entourée de hautes herbes"
                    fill
                    priority
                    sizes="(max-width: 1023px) calc(100vw - 28px), min(77.3vw, 1484px)"
                    className="object-cover"
                />
            </div>

            {loadingError ? (
                <section className="mt-11 rounded-xl bg-white px-6 py-12 text-center" aria-live="polite">
                    <h2 className="text-xl font-semibold">Les logements sont momentanément indisponibles</h2>
                    <p className="mt-2 text-sm text-[#666a6d]">Veuillez actualiser la page dans quelques instants.</p>
                </section>
            ) : properties.length === 0 ? (
                <p className="mt-11 rounded-xl bg-white px-6 py-12 text-center" aria-live="polite">
                    Aucun logement n’est disponible pour le moment.
                </p>
            ) : (
                <section className="mt-11 grid gap-11 sm:grid-cols-2 lg:mt-21 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-8" aria-label="Logements à découvrir">
                    {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
                </section>
            )}

            <section className="mt-12 rounded-xl bg-white px-2 py-10 text-center lg:mt-14 lg:px-32 lg:py-14">
                <h2 className="text-xl font-bold lg:text-[28px]">Comment ça marche ?</h2>
                <p className="mx-auto mt-5 max-w-4xl text-sm leading-5 lg:mt-4">
                    Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage professionnel,<br className="hidden lg:block" /> Kasa vous aide à trouver un lieu qui vous ressemble.
                </p>

                <ol className="mt-12 grid gap-2 text-left lg:grid-cols-3 lg:gap-6">
                    {steps.map(({ title, description }) => (
                        <li key={title} className="flex min-h-52 flex-col justify-center rounded-lg bg-(--brand-hover) px-4 py-7 text-white lg:px-7">
                            <h3 className="text-lg font-medium">{title}</h3>
                            <p className="mt-5 text-sm leading-4 lg:leading-5">{description}</p>
                        </li>
                    ))}
                </ol>
            </section>
        </main>
    );
}
