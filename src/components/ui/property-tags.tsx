/**
 * Affiche une liste de tags pour une propriété.
 *
 * @param values Les valeurs des tags à afficher.
 * @param asAmenities Indique si les tags doivent être affichés comme des commodité (par exemple, une caractéristique ou un service) pour le balisage Schema.org.
 *
 * @returns The rendered tag list.
 */
export function PropertyTags({ values, asAmenities = false }: { values: string[]; asAmenities?: boolean }) {
    if (values.length === 0) {
        return <p className="text-sm text-[#707477]">Aucune information renseignée.</p>;
    }

    return (
        <ul className="flex flex-wrap gap-2">
            {values.map((value) => (
                <li
                    key={value}
                    itemProp={asAmenities ? "amenityFeature" : undefined}
                    itemScope={asAmenities || undefined}
                    itemType={asAmenities ? "https://schema.org/LocationFeatureSpecification" : undefined}
                    className="rounded-md bg-[#f5f5f5] px-5 py-2 text-xs text-[#666a6d]"
                >
                    <span itemProp={asAmenities ? "name" : undefined}>{value}</span>
                    {asAmenities && <meta itemProp="value" content="true" />}
                </li>
            ))}
        </ul>
    );
}
