"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "kasa:favorites";
const EMPTY_FAVORITES: string[] = [];

type FavoritesContextValue = {
    isAuthenticated: boolean;
    favoriteIds: string[] | null;
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Lit les IDs enregistrés et ignore les données anciennes ou invalides.
 *
 * @param value La valeur brute du localStorage.
 *
 * @return Un tableau d'IDs uniques, ou un tableau vide si le localStorage est vide ou invalide.
 */
function parseFavoriteIds(value: string | null): string[] {
    if (!value) {
        return EMPTY_FAVORITES;
    }

    try {
        // JSON.parse peut lever une exception si la valeur n'est pas un JSON valide.
        const parsed: unknown = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return EMPTY_FAVORITES;
        }

        // Filtre les IDs invalides et supprime les doublons.
        const uniqueIds: string[] = [];

        for (const id of parsed) {
            if (typeof id !== "string" || id.length === 0) {
                continue;
            }

            if (!uniqueIds.includes(id)) {
                uniqueIds.push(id);
            }
        }

        return uniqueIds;
    } catch {
        return EMPTY_FAVORITES;
    }
}

/**
 * Lit les favoris depuis le localStorage.
 *
 * @return Un tableau d'IDs uniques, ou un tableau vide si le localStorage est vide ou invalide.
 */
function readFavorites(): string[] {
    try {
        return parseFavoriteIds(window.localStorage.getItem(STORAGE_KEY));
    } catch {
        return EMPTY_FAVORITES;
    }
}

export function FavoritesProvider({ children, isAuthenticated }: { children: ReactNode; isAuthenticated: boolean }) {
    // null assure un premier rendu identique sur le serveur et dans le navigateur.
    const [favoriteIds, setFavoriteIds] = useState<string[] | null>(null);

    // Lit les favoris au premier rendu et synchronise les changements de localStorage entre plusieurs onglets.
    useEffect(() => {
        // Lecture après hydratation pour garder le même premier rendu sur le serveur et le navigateur.
        setFavoriteIds(readFavorites());

        // On écoute les changements de localStorage pour synchroniser les favoris entre plusieurs onglets.
        const onStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY || event.key === null) {
                setFavoriteIds(readFavorites());
            }
        };

        window.addEventListener("storage", onStorage);

        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Ajoute ou retire un ID de la liste des favoris et met à jour le localStorage.
    function toggleFavorite(id: string) {
        if (!isAuthenticated || !id) {
            return
        };

        const favorites = readFavorites();
        // Si l'ID est déjà présent, on le retire ; sinon, on l'ajoute.
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter((favoriteId) => favoriteId !== id)
            : [...favorites, id];

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));

            setFavoriteIds(updatedFavorites);
        } catch {
            // Si le stockage est indisponible, les favoris restent inchangés.
        }
    }

    const value: FavoritesContextValue = {
        isAuthenticated,
        favoriteIds,
        isFavorite: (id) => isAuthenticated && (favoriteIds?.includes(id) ?? false),
        toggleFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

/**
 * Fournit un accès au contexte des favoris.
 *
 * @throws {Error} Si le hook est utilisé en dehors d'un FavoritesProvider.
 */
export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
    }
    return context;
}
