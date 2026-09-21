import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { CarouselArrow } from "../../ui/icons/carousel-arrow";
import { getFollowingImageIndexes, wrapCarouselIndex } from "./carousel-utils";

type MobilePropertyCarouselProps = {
    images: string[];
    propertyTitle: string;
};

/**
 * Affiche et contrôle le carrousel utilisé sur mobile.
 *
 * @param images Les chemins des images à afficher.
 * @param propertyTitle Le titre du logement, utilisé pour l'accessibilité.
 *
 * @returns Le carrousel mobile.
 */
export function MobilePropertyCarousel({ images, propertyTitle }: MobilePropertyCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageCount = images.length;
    const hasNavigation = imageCount > 1;

    /** Sélectionne une image en bouclant entre la première et la dernière. */
    const showImage = (index: number) => {
        setCurrentIndex(wrapCarouselIndex(index, imageCount));
    };

    /** Permet de naviguer avec les flèches du clavier ainsi qu'avec Home et End. */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!hasNavigation) return;

        const destinations: Partial<Record<string, number>> = {
            ArrowLeft: currentIndex - 1,
            ArrowRight: currentIndex + 1,
            Home: 0,
            End: imageCount - 1,
        };
        const destination = destinations[event.key];

        if (destination === undefined) return;

        event.preventDefault();
        showImage(destination);
    };

    const thumbnailIndexes = getFollowingImageIndexes(currentIndex, imageCount);

    return (
        <div
            role="region"
            aria-roledescription="carrousel"
            aria-label={`Photos de ${propertyTitle}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="lg:hidden"
        >
            <div className="relative h-104 overflow-hidden rounded-xl">
                <Image
                    key={`${currentIndex}-${images[currentIndex]}`}
                    src={images[currentIndex]}
                    alt={`Photo ${currentIndex + 1} sur ${imageCount} du logement « ${propertyTitle} »`}
                    fill
                    priority={currentIndex === 0}
                    sizes="calc(100vw - 30px)"
                    className="carousel-image-enter object-cover"
                />

                {hasNavigation && (
                    <>
                        <button
                            type="button"
                            onClick={() => showImage(currentIndex - 1)}
                            aria-label="Afficher l’image précédente"
                            className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-(--brand) shadow-sm transition-colors hover:cursor-pointer hover:bg-white"
                        >
                            <CarouselArrow direction="left" />
                        </button>
                        <button
                            type="button"
                            onClick={() => showImage(currentIndex + 1)}
                            aria-label="Afficher l’image suivante"
                            className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-(--brand) shadow-sm transition-colors hover:cursor-pointer hover:bg-white"
                        >
                            <CarouselArrow direction="right" />
                        </button>
                    </>
                )}

                <span className="sr-only" aria-live="polite">
                    Image {currentIndex + 1} sur {imageCount}
                </span>
            </div>

            {thumbnailIndexes.length > 0 && (
                <div className="mt-2 grid h-27 grid-cols-4 gap-2">
                    {thumbnailIndexes.map((imageIndex) => (
                        <button
                            key={imageIndex}
                            type="button"
                            onClick={() => showImage(imageIndex)}
                            aria-label={`Afficher l’image ${imageIndex + 1} sur ${imageCount}`}
                            className="relative min-h-0 overflow-hidden rounded-lg"
                        >
                            <Image
                                src={images[imageIndex]}
                                alt={`Aperçu de la photo ${imageIndex + 1} du logement « ${propertyTitle} »`}
                                fill
                                sizes="25vw"
                                className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
