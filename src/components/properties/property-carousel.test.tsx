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
    it("affiche la première image et permet de choisir une miniature", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");

        await user.click(screen.getByRole("button", { name: "Afficher l’image 2 sur 3" }));

        expect(screen.getByRole("img", { name: /Photo 2 sur 3/ }).getAttribute("src")).toBe("/two.jpg");
    });

    it("boucle entre la première et la dernière image", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        await user.click(screen.getByRole("button", { name: "Afficher l’image précédente" }));
        expect(screen.getByRole("img", { name: /Photo 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        await user.click(screen.getByRole("button", { name: "Afficher l’image suivante" }));
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");
    });

    it("réagit aux touches directionnelles, Home et End", () => {
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);
        const carousel = screen.getByRole("region", { name: "Photos de Appartement cosy" });

        fireEvent.keyDown(carousel, { key: "End" });
        expect(screen.getByRole("img", { name: /Photo 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        fireEvent.keyDown(carousel, { key: "ArrowRight" });
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");

        fireEvent.keyDown(carousel, { key: "ArrowLeft" });
        expect(screen.getByRole("img", { name: /Photo 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        fireEvent.keyDown(carousel, { key: "Home" });
        expect(screen.getByRole("img", { name: /Photo 1 sur 3/ }).getAttribute("src")).toBe("/one.jpg");
    });

    it("masque les commandes lorsqu’il n’y a qu’une seule image", () => {
        render(<PropertyCarousel images={[images[0]]} propertyTitle="Appartement cosy" />);

        expect(screen.queryByRole("button", { name: "Afficher l’image précédente" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Afficher l’image suivante" })).toBeNull();
        expect(screen.getByRole("img", { name: /Photo 1 sur 1/ })).toBeTruthy();
    });

    it("ouvre la galerie agrandie, la navigue et la ferme au clavier", async () => {
        const user = userEvent.setup();
        render(<PropertyCarousel images={images} propertyTitle="Appartement cosy" />);

        await user.click(screen.getByRole("button", { name: "Agrandir la photo 2 sur 3" }));

        expect(screen.getByRole("dialog", { name: "Galerie agrandie de Appartement cosy" })).toBeTruthy();
        expect(screen.getByRole("img", { name: /Photo agrandie 2 sur 3/ }).getAttribute("src")).toBe("/two.jpg");

        fireEvent.keyDown(document, { key: "ArrowRight" });
        expect(screen.getByRole("img", { name: /Photo agrandie 3 sur 3/ }).getAttribute("src")).toBe("/three.jpg");

        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog", { name: "Galerie agrandie de Appartement cosy" })).toBeNull();
    });
});
