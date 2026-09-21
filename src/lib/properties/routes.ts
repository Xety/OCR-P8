type PropertyRoute = {
    id: string;
    slug: string;
};

const PROPERTY_REFERENCE_SEPARATOR = ".";

/**
 * Construit l'URL publique d'une propriété avec son identifiant et son slug.
 *
 * @param id L'identifiant unique de la propriété.
 * @param slug Le slug de la propriété, utilisé pour l'URL.
 *
 * @returns L'URL publique de la propriété.
 */
export function getPropertyHref({ id, slug }: PropertyRoute) {
    return `/properties/${id}${PROPERTY_REFERENCE_SEPARATOR}${slug}`;
}

/**
 * Extrait l'identifiant et le slug présents dans le segment dynamique de l'URL.
 *
 * @param reference La référence de la propriété, formatée comme "id.slug".
 *
 * @returns Les informations de la propriété ou null si la référence est invalide.
 */
export function parsePropertyReference(reference: string): PropertyRoute | null {
    const separatorIndex = reference.indexOf(PROPERTY_REFERENCE_SEPARATOR);

    if (separatorIndex <= 0 || separatorIndex === reference.length - 1) {
        return null;
    }

    return {
        id: reference.slice(0, separatorIndex),
        slug: reference.slice(separatorIndex + 1),
    };
}
