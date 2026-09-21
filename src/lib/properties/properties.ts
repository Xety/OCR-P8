import "server-only";
import { ApiError, apiRequest } from "@/lib/api/api";
import {
    propertyDetailsSchema,
    propertyListSchema,
    type PropertyDetails,
    type PropertySummary,
} from "@/lib/properties/validation";

/***
 * Récupère la liste des propriétés depuis l'API.
 *
 * @returns {Promise<PropertySummary[]>} Une promesse qui résout un tableau de résumés de propriétés.
 *
 * @throws {ApiError} Si la réponse de l'API est invalide ou si une erreur se produit lors de la requête.
 */
export async function getProperties(): Promise<PropertySummary[]> {
    const response = await apiRequest<unknown>("/api/properties");
    const result = propertyListSchema.safeParse(response);

    if (!result.success) {
        throw new ApiError(200, "INVALID_RESPONSE");
    }

    return result.data;
}

/**
 * Charge directement le détail d'une propriété depuis son identifiant API.
 *
 * @param id L'identifiant unique de la propriété.
 *
 * @returns Les détails de la propriété ou null si elle n'est pas trouvée.
 */
export async function getPropertyById(id: string): Promise<PropertyDetails | null> {
    let response: unknown;

    try {
        response = await apiRequest<unknown>(`/api/properties/${encodeURIComponent(id)}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }

        throw error;
    }

    const result = propertyDetailsSchema.safeParse(response);

    if (!result.success) {
        throw new ApiError(200, "INVALID_RESPONSE");
    }

    return result.data;
}
