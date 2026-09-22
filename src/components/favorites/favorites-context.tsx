"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const STORAGE_KEY = "kasa:favorites";
const FAVORITES_UPDATED_EVENT = "kasa:favorites-updated";
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
 * Lit la valeur brute des favoris depuis le localStorage.
 *
 * @return La valeur enregistrée, ou null si le stockage est vide ou indisponible.
 */
function readStoredFavorites(): string | null {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

/**
 * Abonne un callback aux changements de favoris, que ce soit dans le même onglet ou dans d'autres.
 *
 * @param onChange Le callback à exécuter lorsque les favoris changent.
 *
 * @returns Une fonction de désabonnement à appeler pour arrêter d'écouter les changements.
 */
function subscribeToFavorites(onChange: () => void) {
    // L'événement storage est émis dans les autres onglets, pas dans celui qui écrit.
    const onStorage = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY || event.key === null) {
            onChange();
        }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(FAVORITES_UPDATED_EVENT, onChange);

    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(FAVORITES_UPDATED_EVENT, onChange);
    };
}

export function FavoritesProvider({ children, isAuthenticated }: { children: ReactNode; isAuthenticated: boolean }) {
    // Utilise useSyncExternalStore pour suivre les changements de favoris dans le localStorage et entre les onglets.
    const storedFavorites = useSyncExternalStore(subscribeToFavorites, readStoredFavorites, () => undefined);
    const favoriteIds = storedFavorites === undefined ? null : parseFavoriteIds(storedFavorites);

    // Ajoute ou retire un ID de la liste des favoris et met à jour le localStorage.
    function toggleFavorite(id: string) {
        if (!isAuthenticated || !id) {
            return
        };

        const favorites = parseFavoriteIds(readStoredFavorites());
        // Si l'ID est déjà présent, on le retire ; sinon, on l'ajoute.
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter((favoriteId) => favoriteId !== id)
            : [...favorites, id];

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
            window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
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
