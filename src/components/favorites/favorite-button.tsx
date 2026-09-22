"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/ui/icons/heart-icon";
import { useFavorites } from "./favorites-context";

type FavoriteButtonProps = {
    propertyId: string;
    propertyTitle: string;
    className?: string;
};

export function FavoriteButton({ propertyId, propertyTitle, className = "" }: FavoriteButtonProps) {
    const { isAuthenticated, isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(propertyId);

    if (!isAuthenticated) {
        return (
            <Link href="/login" aria-label={`Se connecter pour ajouter ${propertyTitle} aux favoris`} className={`flex size-10 items-center justify-center rounded-md shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) hover:cursor-pointer ${favorite ? "bg-(--brand) text-white hover:bg-(--brand-hover)" : "bg-white text-[#92979b] hover:text-(--brand)"} ${className}`}>
                <HeartIcon className="size-4" />
            </Link>
        );
    }

    return (
        <button
            type="button"
            aria-label={`${favorite ? "Retirer" : "Ajouter"} ${propertyTitle} ${favorite ? "des" : "aux"} favoris`}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(propertyId)}
            className={`flex size-10 items-center justify-center rounded-md shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) hover:cursor-pointer ${favorite ? "bg-(--brand) text-white hover:bg-(--brand-hover)" : "bg-white text-[#92979b] hover:text-(--brand)"} ${className}`}
        >
            <HeartIcon filled={favorite} className="size-4" />
        </button>
    );
}
