import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteButton } from "./favorite-button";
import { FavoritesProvider } from "./favorites-context";
import { FavoritesGrid } from "./favorites-grid";

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
        React.createElement("img", { alt: props.alt, src: props.src }),
}));

const properties = [
    { id: "a", slug: "appartement", title: "Appartement", cover: null, location: null, price_per_night: 100 },
    { id: "b", slug: "chalet", title: "Chalet", cover: null, location: null, price_per_night: 120 },
];

// On simule le localStorage pour les tests, car il n'est pas disponible dans l'environnement de test.
beforeEach(() => {
    const values = new Map<string, string>();

    vi.stubGlobal("localStorage", {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
        clear: () => values.clear(),
    });
});
afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

// On teste le composant complet avec le contexte pour vérifier l'interaction entre les boutons et la grille de favoris.
function renderFavorites(isAuthenticated = true) {
    return render(
        <FavoritesProvider isAuthenticated={isAuthenticated}>
            <FavoriteButton propertyId="a" propertyTitle="Appartement" />
            <FavoriteButton propertyId="b" propertyTitle="Chalet" />
            <FavoritesGrid properties={properties} />
        </FavoritesProvider>,
    );
}

describe("favoris locaux", () => {
    it("redirige un visiteur vers la connexion sans ajouter de favori", () => {
        renderFavorites(false);

        const loginLink = screen.getByRole("link", { name: "Se connecter pour ajouter Appartement aux favoris" });
        expect(loginLink.getAttribute("href")).toBe("/login");
        expect(screen.queryByRole("button", { name: "Ajouter Appartement aux favoris" })).toBeNull();
        expect(localStorage.getItem("kasa:favorites")).toBeNull();
    });

    it("affiche un état vide quand aucun favori n'est enregistré", () => {
        renderFavorites();

        expect(screen.getByText("Vous n’avez pas encore de favoris.")).toBeTruthy();
    });

    it("ajoute puis supprime un favori et met à jour le stockage", async () => {
        const user = userEvent.setup();
        renderFavorites();

        // On clique sur le bouton pour ajouter un favori et on vérifie que le stockage local est mis à jour.
        await user.click(screen.getByRole("button", { name: "Ajouter Appartement aux favoris" }));

        expect(screen.getByRole("heading", { name: "Appartement" })).toBeTruthy();
        expect(JSON.parse(localStorage.getItem("kasa:favorites") ?? "null")).toEqual(["a"]);

        // On clique sur le bouton pour retirer le favori et on vérifie que le stockage local est mis à jour.
        await user.click(screen.getAllByRole("button", { name: "Retirer Appartement des favoris" })[0]);
        expect(JSON.parse(localStorage.getItem("kasa:favorites") ?? "null")).toEqual([]);
        expect(screen.getByText("Vous n’avez pas encore de favoris.")).toBeTruthy();
    });

    it("ajoute un favori en conservant les favoris déjà enregistrés", async () => {
        // On simule un favori déjà enregistré dans le stockage local.
        localStorage.setItem("kasa:favorites", JSON.stringify(["a"]));
        const user = userEvent.setup();
        renderFavorites();

        // On clique sur le bouton pour ajouter un nouveau favori et on vérifie que le stockage local contient les deux favoris.
        await user.click(screen.getByRole("button", { name: "Ajouter Chalet aux favoris" }));

        expect(JSON.parse(localStorage.getItem("kasa:favorites") ?? "null")).toEqual(["a", "b"]);
        expect(screen.getByRole("heading", { name: "Appartement" })).toBeTruthy();
        expect(screen.getByRole("heading", { name: "Chalet" })).toBeTruthy();
    });

    it("retrouve les favoris enregistrés après un nouveau montage", () => {
        // On simule un favori déjà enregistré dans le stockage local.
        localStorage.setItem("kasa:favorites", JSON.stringify(["b"]));
        const view = renderFavorites();
        expect(screen.getByRole("heading", { name: "Chalet" })).toBeTruthy();

        // On démonte et remonte le composant pour vérifier que les favoris sont toujours affichés correctement.
        view.unmount();
        renderFavorites();
        expect(screen.getByRole("heading", { name: "Chalet" })).toBeTruthy();
        expect(screen.queryByRole("heading", { name: "Appartement" })).toBeNull();
    });

    it("ignore une valeur locale invalide sans bloquer la page", () => {
        // On simule une valeur invalide dans le stockage local.
        localStorage.setItem("kasa:favorites", "{invalide");
        renderFavorites();

        // On vérifie que le composant affiche un état vide sans planter.
        expect(screen.getByText("Vous n’avez pas encore de favoris.")).toBeTruthy();
    });
});
