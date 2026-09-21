/**
 * Affiche l'icône d'étoile, utilisée pour les évaluations.
 *
 * @returns L'icône étoile.
 */
export function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5 text-(--brand)">
            <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
        </svg>
    );
}