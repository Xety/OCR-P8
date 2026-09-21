type HeartIconProps = {
    className?: string;
    filled?: boolean;
};

/**
 * Affiche l'icône de cœur, utilisée pour les favoris.
 *
 * @param className La classe CSS à appliquer à l'icône.
 * @param filled Indique si le cœur est rempli ou non.
 *
 * @returns
 */
export function HeartIcon({ className = "size-5", filled = false }: HeartIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
            className={className}
        >
            <path d="M20.8 8.4c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6Z" />
        </svg>
    );
}
