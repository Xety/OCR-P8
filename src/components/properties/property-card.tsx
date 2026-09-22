import Image from "next/image";
import Link from "next/link";
import type { PropertySummary } from "@/lib/properties/validation";
import { getPropertyHref } from "@/lib/properties/routes";
import { FavoriteButton } from "@/components/favorites/favorite-button";

export function PropertyCard({ property }: { property: PropertySummary; }) {
    const propertyHref = getPropertyHref(property);
    const imageAlt = property.location
        ? `Photo du logement « ${property.title} » à ${property.location}`
        : `Photo du logement « ${property.title} »`;

    return (
        <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl bg-white">
            <Link href={propertyHref} className="relative block aspect-[0.945/1] overflow-hidden">
                {property.cover ? (
                    <Image
                        src={property.cover}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 1023px) calc(100vw - 28px), min(25vw, 472px)"
                        className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                ) : (
                    <span className="flex size-full items-center justify-center bg-[#f1eeec] px-5 text-center text-sm text-[#6b6b6b]">
                        Image indisponible
                    </span>
                )}
            </Link>

            <FavoriteButton
                propertyId={property.id}
                propertyTitle={property.title}
                className="absolute top-5 right-5"
            />

            <div className="flex flex-1 flex-col min-h-36 px-5 py-4 lg:min-h-47 lg:px-8 lg:py-6">
                <h2 className="font-medium text-base leading-6">
                    <Link href={propertyHref} className="hover:text-(--brand) hover:underline">
                        {property.title}
                    </Link>
                </h2>
                {property.location && (
                    <p className="mt-1 text-[#6f7173] text-sm">
                        {property.location}</p>
                )}
                <p className="mt-auto pt-7 font-medium text-sm">
                    {property.price_per_night.toLocaleString("fr-FR")}€
                    <span className="ml-1 font-normal text-[#6f7173]">par nuit</span>
                </p>
            </div>
        </article>
    );
}
