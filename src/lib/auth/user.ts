import "server-only";
import { cache } from "react";
import { z } from "zod";
import { apiRequest } from "@/lib/api/api";
import { getSessionToken } from "@/lib/auth/session";

const role = z.enum(["client", "owner", "admin"]);
const tokenPayload = z.object({ id: z.number().int().positive(), role });
const userSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    role,
});

export type CurrentUser = z.infer<typeof userSchema>;

/**
 * List le payload d'un token JWT sans vérifier sa signature. Le token est utilisé pour identifier l'utilisateur courant, mais la vérification de la signature et des permissions est effectuée par l'API.
 *
 * @param token Le token JWT à décoder.
 *
 * @returns Un objet contenant l'identité de l'utilisateur si le token est valide, ou null si le token est invalide ou mal formé.
 */
function readTokenIdentity(token: string) {
    try {
        return tokenPayload.safeParse(
            JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")),
        );
    } catch {
        return null;
    }
}

/**
 * Récupère l'utilisateur authentifié actuel. Cette fonction lit le token de session, décode son payload pour identifier l'utilisateur, puis effectue une requête API pour récupérer les informations complètes de l'utilisateur.
 *
 * @returns Une promise qui se résout en l'utilisateur actuel, ou en null s'il n'est pas authentifié.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    const token = await getSessionToken();

    if (!token) {
        return null;
    };

    const identity = readTokenIdentity(token);

    if (!identity?.success) {
        return null;
    };

    try {
        const response = await apiRequest<unknown>(`/api/users/${identity.data.id}`, { token });
        const user = userSchema.safeParse(response);
        if (!user.success || user.data.id !== identity.data.id) {
            return null;
        };
        return user.data;
    } catch {
        return null;
    }
});
