import type { MetadataRoute } from 'next'
import { getProperties } from "@/lib/properties/properties";
import { getPropertyHref } from "@/lib/properties/routes";

const siteUrl = (process.env.SITE_URL || "http://localhost:3000");

/**
 * Génère le sitemap pour le site, incluant les pages statiques et les pages dynamiques des propriétés.
 * url : L'URL complète de la page.
 * changeFrequency : La fréquence à laquelle la page est susceptible de changer (daily, weekly, monthly).
 * priority : La priorité de cette URL par rapport aux autres URL de votre site (0.0 à 1.0).
 *
 * @returns Un tableau d'objets représentant les URLs du sitemap avec leurs fréquences de changement et priorités.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/about`,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    try {
        // Récupère les propriétés depuis l'API
        const properties = await getProperties();
        const propertyPages: MetadataRoute.Sitemap = properties.map(
            (property): MetadataRoute.Sitemap[number] => ({
                url: `${siteUrl}${getPropertyHref(property)}`,
                changeFrequency: 'weekly',
                priority: 0.8,
            }),
        );

        return [...staticPages, ...propertyPages];
    } catch {
        return staticPages;
    }
}
