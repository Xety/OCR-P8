/**
 * Renders a list of tags.
 *
 * @param values The array of tag values to display.
 *
 * @returns The rendered tag list.
 */
export function PropertyTags({ values }: { values: string[] }) {
    if (values.length === 0) {
        return <p className="text-sm text-[#707477]">Aucune information renseignée.</p>;
    }

    return (
        <ul className="flex flex-wrap gap-2">
            {values.map((value) => (
                <li key={value} className="rounded-md bg-[#f5f5f5] px-5 py-2 text-xs text-[#666a6d]">
                    {value}
                </li>
            ))}
        </ul>
    );
}