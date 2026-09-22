"use client";

import { PropertyCard } from "@/components/properties/property-card";
import type { PropertySummary } from "@/lib/properties/validation";
import { useFavorites } from "./favorites-context";

export function FavoritesGrid({ properties }: { properties: PropertySummary[] }) {
    const { favoriteIds } = useFavorites();

    if (favoriteIds === null) {
        return (
            <p className="mt-12 text-center text-[#666a6d] lg:mt-21" role="status">
                Chargement des favoris…
            </p>
        );
    }

    const favorites = properties.filter((property) => favoriteIds.includes(property.id));

    if (favorites.length === 0) {
        return (
            <p className="mt-12 rounded-xl bg-white px-6 py-12 text-center text-[#666a6d] lg:mt-21">
                Vous n’avez pas encore de favoris.
            </p>
        );
    }

    return (
        <section className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-21 lg:grid-cols-3" aria-label="Mes logements favoris">
            {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </section>
    );
}
