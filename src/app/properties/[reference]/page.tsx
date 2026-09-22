import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyCarousel } from "@/components/properties/property-carousel";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { Button } from "@/components/ui/button";
import { getPropertyById } from "@/lib/properties/properties";
import { parsePropertyReference } from "@/lib/properties/routes";
import { PropertyTags } from "@/components/ui/property-tags";
import { LocationIcon } from "@/components/ui/icons/location-icon";
import { StarIcon } from "@/components/ui/icons/star-icon";
import { getCurrentUser } from "@/lib/auth/user";

/**
 * Affiche la page d'un logement spécifique, incluant la galerie d'images, les détails du logement et les informations sur l'hôte.
 *
 * @param params Les paramètres de la route, incluant la référence du logement.
 *
 * @returns La page du logement spécifique.
 */
export default async function PropertyPage({ params }: PageProps<"/properties/[reference]">) {
    const { reference } = await params;
    const propertyReference = parsePropertyReference(reference);

    if (!propertyReference) {
        notFound();
    }

    const property = await getPropertyById(propertyReference.id);

    if (!property) {
        notFound();
    }

    const messageHref = (await getCurrentUser()) ? `/messages?property=${property.id}` : "/login";

    // Prépare les images à afficher dans le carrousel, en s'assurant que la couverture est en première position et en éliminant les doublons.
    const picturesWithCover = property.cover
        ? [property.cover, ...property.pictures]
        : property.pictures;
    const pictures = [...new Set(picturesWithCover)];

    const rating = property.rating_avg === null
        ? "—"
        : Number.isInteger(property.rating_avg)
            ? property.rating_avg.toFixed(0)
            : property.rating_avg.toFixed(1).replace(".", ",");

    return (
        <main className="mx-auto w-full max-w-7xl flex-1 px-3.5 py-10">
            <Link
                href="/"
                className="mt-0 inline-flex rounded-lg bg-[#f3f3f3] px-5 py-3 text-sm text-[#505356] transition-colors hover:bg-[#e9e9e9] lg:ml-1"
            >
                ← Retour aux annonces
            </Link>

            <div className="mt-2 grid grid-cols-12 items-start gap-3 lg:mt-9">
                <div className="col-span-full lg:col-span-8">
                    <PropertyCarousel images={pictures} propertyTitle={property.title} />

                    <article className="mt-3 rounded-xl border border-[#ececec] bg-white px-6 py-7 lg:mt-5 lg:px-5">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-2xl font-medium lg:text-[26px]">{property.title}</h1>
                            <FavoriteButton propertyId={property.id} propertyTitle={property.title} />
                        </div>
                        {property.location && (
                            <p className="mt-4 flex items-center gap-2 text-sm text-[#65696c]">
                                <LocationIcon />
                                {property.location}
                            </p>
                        )}

                        {property.description && <p className="mt-10 text-sm leading-5">{property.description}</p>}

                        <div className="mt-9 space-y-8">
                            <section aria-labelledby="equipments-title">
                                <h2 id="equipments-title" className="font-medium">Équipements</h2>
                                <div className="mt-4">
                                    <PropertyTags values={property.equipments} />
                                </div>
                            </section>

                            <section aria-labelledby="categories-title">
                                <h2 id="categories-title" className="font-medium">Catégories</h2>
                                <div className="mt-4">
                                    <PropertyTags values={property.tags} />
                                </div>
                            </section>
                        </div>
                    </article>
                </div>

                <aside className="col-span-full lg:col-span-4 rounded-xl border border-[#ececec] bg-white px-6 py-6 lg:px-5">
                    <h2 className="text-lg font-medium">Votre hôte</h2>

                    <div className="mt-7 flex items-center gap-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-[#f1eeec]">
                            {property.host.picture ? (
                                <Image
                                    src={property.host.picture}
                                    alt={`Portrait de ${property.host.name}, hôte du logement`}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="flex size-full items-center justify-center text-xl font-medium text-(--brand)">
                                    {property.host.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <p className="min-w-0 flex-1 text-base">{property.host.name}</p>
                        <p className="flex items-center gap-1 rounded-xl bg-[#f7f7f7] px-3 py-2" aria-label={`Note moyenne : ${rating} sur 5`}>
                            <StarIcon />
                            <span>{rating}</span>
                        </p>
                    </div>

                    <div className="mt-6 space-y-2">
                        <Button href={messageHref} className="inline-flex w-full justify-center py-2.5">
                            Contacter l’hôte
                        </Button>
                        <Button href={messageHref} className="inline-flex w-full justify-center py-2.5">
                            Envoyer un message
                        </Button>
                    </div>
                </aside>
            </div>
        </main>
    );
}
