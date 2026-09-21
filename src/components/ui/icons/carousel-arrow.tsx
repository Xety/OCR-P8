type CarouselArrowProps = {
    direction: "left" | "right";
};

/**
 * Affiche l'icône directionnelle utilisée par les boutons de navigation.
 *
 * @param direction La direction de l'icône.
 *
 * @returns L'icône directionnelle.
 */
export function CarouselArrow({ direction }: CarouselArrowProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="size-6">
            <path
                d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
