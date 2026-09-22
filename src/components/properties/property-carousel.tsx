"use client";

import { useCallback, useState } from "react";
import { DesktopPropertyGallery } from "./carousel/desktop-property-gallery";
import { MobilePropertyCarousel } from "./carousel/mobile-property-carousel";
import { DesktopPropertyLightbox } from "./carousel/desktop-property-lightbox";

type PropertyCarouselProps = {
    images: string[];
    propertyTitle: string;
};

type LightboxState = {
    initialIndex: number;
    trigger: HTMLButtonElement;
} | null;

/**
 * Coordonne les deux présentations de la galerie :
 * le carrousel mobile et la mosaïque desktop avec sa lightbox.
 *
 * @param images Les chemins des images à afficher.
 * @param propertyTitle Le titre du logement, utilisé pour l'accessibilité.
 *
 * @returns Le carrousel de la propriété.
 */
export function PropertyCarousel({ images, propertyTitle }: PropertyCarouselProps) {
    const [lightbox, setLightbox] = useState<LightboxState>(null);

    // Ouvre la lightbox sur l'image sélectionnée et mémorise le bouton déclencheur.
    const openLightbox = useCallback((initialIndex: number, trigger: HTMLButtonElement) => {
        setLightbox({ initialIndex, trigger });
    }, []);

    // Ferme la lightbox ; celle-ci rend ensuite le focus à son bouton déclencheur.
    const closeLightbox = useCallback(() => {
        setLightbox(null);
    }, []);

    if (images.length === 0) {
        return (
            <div className="flex h-104 items-center justify-center rounded-xl bg-[#efedeb] text-sm text-[#666a6d] lg:h-85">
                Aucune image disponible
            </div>
        );
    }

    return (
        <>
            <MobilePropertyCarousel images={images} propertyTitle={propertyTitle} />
            <DesktopPropertyGallery
                images={images}
                propertyTitle={propertyTitle}
                onOpen={openLightbox}
            />

            {lightbox && (
                <DesktopPropertyLightbox
                    images={images}
                    initialIndex={lightbox.initialIndex}
                    propertyTitle={propertyTitle}
                    returnFocusTo={lightbox.trigger}
                    onClose={closeLightbox}
                />
            )}
        </>
    );
}
