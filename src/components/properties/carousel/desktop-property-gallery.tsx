import Image from "next/image";

type DesktopPropertyGalleryProps = {
    images: string[];
    propertyTitle: string;
    onOpen: (index: number, trigger: HTMLButtonElement) => void;
};

/**
 * Affiche la mosaïque desktop et transmet l'image sélectionnée à la lightbox.
 *
 * @param images Les chemins des images à afficher.
 * @param propertyTitle Le titre du logement, utilisé pour l'accessibilité.
 * @param onOpen La fonction à appeler pour ouvrir la lightbox.
 *
 * @returns La mosaïque desktop.
 */
export function DesktopPropertyGallery({ images, propertyTitle, onOpen }: DesktopPropertyGalleryProps) {
    const imageCount = images.length;
    const galleryIndexes = Array.from({ length: Math.min(5, imageCount) }, (_, index) => index);

    return (
        <div className="hidden gap-2 lg:grid lg:grid-cols-2" role="region" aria-label={`Galerie de ${propertyTitle}`}>
            <button
                type="button"
                onClick={(event) => onOpen(0, event.currentTarget)}
                aria-label={`Agrandir la photo 1 sur ${imageCount}`}
                className={`relative h-85 overflow-hidden rounded-xl ${imageCount === 1 ? "col-span-2" : ""}`}
            >
                <Image
                    src={images[0]}
                    alt={`Photo 1 de la galerie du logement « ${propertyTitle} »`}
                    fill
                    sizes={imageCount === 1 ? "582px" : "290px"}
                    className="object-cover hover:cursor-pointer"
                />
            </button>

            {galleryIndexes.length > 1 && (
                <div className="grid h-85 grid-cols-2 grid-rows-2 gap-2">
                    {galleryIndexes.slice(1).map((imageIndex) => (
                        <button
                            key={imageIndex}
                            type="button"
                            onClick={(event) => onOpen(imageIndex, event.currentTarget)}
                            aria-label={`Agrandir la photo ${imageIndex + 1} sur ${imageCount}`}
                            className="relative min-h-0 overflow-hidden rounded-lg"
                        >
                            <Image
                                src={images[imageIndex]}
                                alt={`Photo ${imageIndex + 1} de la galerie du logement « ${propertyTitle} »`}
                                fill
                                sizes="145px"
                                className="object-cover hover:cursor-pointer"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
