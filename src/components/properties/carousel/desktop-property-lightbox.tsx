import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CarouselArrow } from "../../ui/icons/carousel-arrow";
import { wrapCarouselIndex } from "./carousel-utils";

type PropertyLightboxProps = {
    images: string[];
    initialIndex: number;
    propertyTitle: string;
    returnFocusTo: HTMLElement;
    onClose: () => void;
};

/**
 * Affiche et contrôle la galerie agrandie accessible sur desktop.
 *
 * @param images Les chemins des images à afficher.
 * @param initialIndex L'index de l'image à afficher au démarrage.
 * @param propertyTitle Le titre du logement, utilisé pour l'accessibilité.
 * @param returnFocusTo Le bouton déclencheur de la lightbox, pour restaurer le focus à la fermeture.
 * @param onClose La fonction à appeler pour fermer la lightbox.
 *
 * @returns La galerie agrandie accessible sur desktop.
 */
export function DesktopPropertyLightbox({
    images,
    initialIndex,
    propertyTitle,
    returnFocusTo,
    onClose,
}: PropertyLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const imageCount = images.length;
    const hasNavigation = imageCount > 1;

    /** Change l'image agrandie en conservant une navigation circulaire. */
    const showImage = (index: number) => {
        setCurrentIndex(wrapCarouselIndex(index, imageCount));
    };

    // Bloque le défilement, gère le clavier et restaure le focus à la fermeture.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        /** Navigue dans la lightbox, la ferme et maintient le focus dans la modale. */
        const handleDocumentKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            } else if (hasNavigation && event.key === "ArrowLeft") {
                event.preventDefault();
                setCurrentIndex((index) => wrapCarouselIndex(index - 1, imageCount));
            } else if (hasNavigation && event.key === "ArrowRight") {
                event.preventDefault();
                setCurrentIndex((index) => wrapCarouselIndex(index + 1, imageCount));
            } else if (hasNavigation && event.key === "Home") {
                event.preventDefault();
                setCurrentIndex(0);
            } else if (hasNavigation && event.key === "End") {
                event.preventDefault();
                setCurrentIndex(imageCount - 1);
            } else if (event.key === "Tab") {
                const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>("button");
                if (!focusableElements?.length) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                // Maintient le focus dans la modale en bouclant entre le premier et le dernier élément focusable.
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleDocumentKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleDocumentKeyDown);
            returnFocusTo.focus();
        };
    }, [hasNavigation, imageCount, onClose, returnFocusTo]);

    return (
        <div
            className="lightbox-enter fixed inset-0 z-50 hidden items-center justify-center bg-black/65 p-8 backdrop-blur-md lg:flex"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={`Galerie agrandie de ${propertyTitle}`}
                className="relative h-[81vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-black/30 shadow-2xl"
            >
                <Image
                    key={`${currentIndex}-${images[currentIndex]}`}
                    src={images[currentIndex]}
                    alt={`Photo agrandie ${currentIndex + 1} sur ${imageCount} du logement « ${propertyTitle} »`}
                    fill
                    sizes="min(92vw, 1152px)"
                    className="carousel-image-enter object-contain"
                />

                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Fermer la galerie"
                    className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white/90 text-[#252525] shadow-md transition-colors hover:cursor-pointer hover:bg-white"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="size-6">
                        <path d="M6 6 18 18M18 6 6 18" strokeLinecap="round" />
                    </svg>
                </button>

                {hasNavigation && (
                    <>
                        <button
                            type="button"
                            onClick={() => showImage(currentIndex - 1)}
                            aria-label="Image précédente dans la galerie agrandie"
                            className="absolute top-1/2 left-5 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-(--brand) shadow-md transition-colors hover:cursor-pointer hover:bg-white"
                        >
                            <CarouselArrow direction="left" />
                        </button>
                        <button
                            type="button"
                            onClick={() => showImage(currentIndex + 1)}
                            aria-label="Image suivante dans la galerie agrandie"
                            className="absolute top-1/2 right-5 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-(--brand) shadow-md transition-colors hover:cursor-pointer hover:bg-white"
                        >
                            <CarouselArrow direction="right" />
                        </button>
                    </>
                )}

                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white" aria-live="polite">
                    {currentIndex + 1} / {imageCount}
                </p>
            </div>
        </div>
    );
}
