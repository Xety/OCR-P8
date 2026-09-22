"use client";

import { HeartIcon } from "@/components/ui/icons/heart-icon";
import { useFavorites } from "./favorites-context";

type FavoriteButtonProps = {
    propertyId: string;
    propertyTitle: string;
    className?: string;
};

export function FavoriteButton({ propertyId, propertyTitle, className = "" }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(propertyId);

    return (
        <button
            type="button"
            aria-label={`${favorite ? "Retirer" : "Ajouter"} ${propertyTitle} ${favorite ? "des" : "aux"} favoris`}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(propertyId)}
            className={`flex items-center justify-center rounded-md shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) size-10 hover:cursor-pointer ${favorite ? "bg-(--brand) text-white hover:bg-(--brand-hover)" : "bg-white text-[#92979b] hover:text-(--brand)"} ${className}`}
        >
            <HeartIcon filled={favorite} className="size-4" />
        </button>
    );
}
