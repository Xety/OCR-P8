/**
 * Retourne un index valide et permet de boucler aux extrémités du carrousel.
 *
 * (-1 % 5) + 5 = 4, mais -1 % 5 = -1, donc on ajoute imageCount pour toujours obtenir un résultat positif.
 * Exemples:
 * wrapCarouselIndex(0, 5);  // 0
 * wrapCarouselIndex(4, 5);  // 4
 * wrapCarouselIndex(5, 5);  // 0
 * wrapCarouselIndex(6, 5);  // 1
 * wrapCarouselIndex(-1, 5); // 4
 *
 * @param index L'index à normaliser.
 * @param imageCount Le nombre d'images dans le carrousel.
 *
 * @returns Un index compris entre 0 et imageCount - 1.
 */
export function wrapCarouselIndex(index: number, imageCount: number) {
    return ((index % imageCount) + imageCount) % imageCount;
}

/**
 * Retourne les index des prochaines images à afficher dans les miniatures.
 *
 * @param currentIndex L'index de l'image actuelle.
 * @param imageCount Le nombre d'images dans le carrousel.
 * @param limit Le nombre maximum d'images à retourner.
 *
 * @returns Un tableau d'index d'images.
 */
export function getFollowingImageIndexes(currentIndex: number, imageCount: number, limit = 4) {
    return Array.from(
        { length: Math.min(limit, imageCount - 1) },
        (_, offset) => wrapCarouselIndex(currentIndex + offset + 1, imageCount),
    );
}
