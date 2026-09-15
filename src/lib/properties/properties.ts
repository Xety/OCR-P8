import "server-only";
import { ApiError, apiRequest } from "@/lib/api/api";
import { propertyListSchema, type PropertySummary } from "@/lib/properties/validation";

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
