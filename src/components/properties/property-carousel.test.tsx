import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyCarousel } from "./property-carousel";

// Mock de l'image Next.js pour les tests, afin d'éviter les erreurs liées à l'environnement de test.
vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
        React.createElement("img", {
            alt: props.alt,
            src: props.src,
            className: props.className,
        }),
}));

afterEach(cleanup);

const images = ["/one.jpg", "/two.jpg", "/three.jpg"];

describe("PropertyCarousel", () => {
    // Teste que le carrousel affiche un message lorsqu'il n'y a pas d'images.
    it("affiche la première image et permet de choisir une miniature", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");

        await user.click(screen.getByRole("button", { name: "Afficher l’image 2 sur 3" }));

        expect(screen.getByRole("img", { name: /Photo 2 sur 3/ }).getAttribute("src")).toBe("/two.jpg");
    });

    // Teste que les commandes de navigation sont masquées lorsqu'il n'y a qu'une seule image sur mobile.
    it("masque les commandes lorsqu’il n’y a qu’une seule image sur mobile", () => {
        render(<PropertyCarousel images={[images[0]]} propertyTitle="Appartement cosy" />);

        expect(screen.queryByRole("button", { name: "Afficher l’image précédente" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Afficher l’image suivante" })).toBeNull();
        expect(screen.getByRole("img", { name: /Photo 1 sur 1/ })).toBeTruthy();
    });

    // Teste que les commandes de navigation sont masquées lorsqu'il n'y a qu'une seule image sur desktop.
    it("masque les commandes lorsqu’il n’y a qu’une seule image sur desktop", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={[images[0]]} propertyTitle="Appartement cosy" />);

        await user.click(screen.getByRole("button", { name: "Agrandir la photo 1 sur 1" }));
        expect(screen.getByRole("dialog", { name: "Galerie agrandie de Appartement cosy" })).toBeTruthy();

        expect(screen.queryByRole("button", { name: "Afficher l’image précédente" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Afficher l’image suivante" })).toBeNull();
        expect(screen.getByRole("img", { name: /Photo 1 sur 1/ })).toBeTruthy();
    });

    // Teste la navigation entre les images avec les boutons "précédent" et "suivant" sur mobile.
    it("boucle entre la première et la dernière image sur mobile", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        await user.click(screen.getByRole("button", { name: "Afficher l’image précédente" }));
        expect(screen.getByRole("img", { name: /Photo 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        await user.click(screen.getByRole("button", { name: "Afficher l’image suivante" }));
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");
    });

    // Teste la navigation clavier et ignore les touches qui ne correspondent pas aux flèches.
    it("navigue dans le carrousel mobile avec les flèches du clavier", () => {
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        const carousel = screen.getByRole("region", { name: "Photos de Appartement cosy" });

        expect(fireEvent.keyDown(carousel, { key: "Enter" })).toBe(true);
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");

        expect(fireEvent.keyDown(carousel, { key: "ArrowRight" })).toBe(false);
        expect(screen.getByRole("img", { name: /Photo 2 sur 3/ }).getAttribute("src")).toBe("/two.jpg");

        expect(fireEvent.keyDown(carousel, { key: "ArrowLeft" })).toBe(false);
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");
    });

    // Vérifie que le clavier ne déclenche aucune navigation lorsqu'une seule image est disponible.
    it("ignore les flèches du clavier sans navigation mobile", () => {
        render(<PropertyCarousel images={[images[0]]} propertyTitle="Appartement cosy" />);

        const carousel = screen.getByRole("region", { name: "Photos de Appartement cosy" });

        expect(fireEvent.keyDown(carousel, { key: "ArrowRight" })).toBe(true);
        expect(screen.getByRole("img", { name: /Photo 1 sur 1/ }).getAttribute("src")).toBe("/one.jpg");
    });

    // Teste la navigation entre les images avec les boutons "précédent" et "suivant" sur desktop.
    it("boucle entre la première et la dernière image sur desktop", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        await user.click(screen.getByRole("button", { name: "Agrandir la photo 2 sur 3" }));
        expect(screen.getByRole("dialog", { name: "Galerie agrandie de Appartement cosy" })).toBeTruthy();

        await user.click(screen.getByRole("button", { name: "Afficher l’image précédente" }));
        expect(screen.getByRole("img", { name: /Photo 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        await user.click(screen.getByRole("button", { name: "Afficher l’image suivante" }));
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");
    });

    // Teste l'ouverture de la galerie lightbox, la navigation entre les images et la fermeture avec le clavier.
    it("ouvre la galerie lightbox, navigue et la ferme au clavier", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        await user.click(screen.getByRole("button", { name: "Agrandir la photo 2 sur 3" }));

        expect(screen.getByRole("dialog", { name: "Galerie agrandie de Appartement cosy" })).toBeTruthy();
        expect(screen.getByRole("img", { name: /Photo agrandie 2 sur 3/ }).getAttribute("src")).toBe("/two.jpg");

        fireEvent.keyDown(document, { key: "ArrowRight" });
        expect(screen.getByRole("img", { name: /Photo agrandie 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        fireEvent.keyDown(document, { key: "ArrowRight" });
        expect(screen.getByRole("img", { name: /Photo agrandie 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");

        fireEvent.keyDown(document, { key: "ArrowLeft" });
        expect(screen.getByRole("img", { name: /Photo agrandie 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog", { name: "Galerie agrandie de Appartement cosy" })).toBeNull();
    });

    // Vérifie que le focus reste dans la lightbox et revient au bouton déclencheur à sa fermeture.
    it("boucle le focus dans la lightbox avec Tab", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        const trigger = screen.getByRole("button", { name: "Agrandir la photo 2 sur 3" });
        await user.click(trigger);

        const dialog = screen.getByRole("dialog", { name: "Galerie agrandie de Appartement cosy" });
        const closeButton = screen.getByRole("button", { name: "Fermer la galerie" });
        const lastButton = screen.getByRole("button", { name: "Image suivante dans la galerie agrandie" });

        expect(document.activeElement).toBe(closeButton);

        const focusableElementsSpy = vi.spyOn(dialog, "querySelectorAll");
        focusableElementsSpy.mockReturnValueOnce([] as unknown as NodeListOf<Element>);
        const tabWithoutControls = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
        document.dispatchEvent(tabWithoutControls);
        expect(tabWithoutControls.defaultPrevented).toBe(false);
        focusableElementsSpy.mockRestore();

        fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
        expect(document.activeElement).toBe(lastButton);

        fireEvent.keyDown(document, { key: "Tab" });
        expect(document.activeElement).toBe(closeButton);

        await user.click(closeButton);
        expect(document.activeElement).toBe(trigger);
    });
});
