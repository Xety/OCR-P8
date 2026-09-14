import "server-only";

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
    ) {
        super(code);
    }
}

/**
 * Effectue une requête API vers le backend avec les options spécifiées.
 *
 * @param path Le chemin de l'API (ex: "/auth/profile").
 * @param options Les options de la requête, y compris la méthode HTTP, le corps de la requête et le token d'authentification.
 *
 * @returns Une promise qui se résout en la réponse de l'API, ou en une erreur si la requête échoue.
 */
export async function apiRequest<T>(
    path: string,
    options: {
        method?: "GET" | "POST";
        body?: unknown;
        token?: string
    } = {},
): Promise<T> {
    const baseUrl = (process.env.API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
    const headers = new Headers({ Accept: "application/json" });

    if (options.body !== undefined) {
        headers.set("Content-Type", "application/json")
    };

    if (options.token) {
        headers.set("Authorization", `Bearer ${options.token}`)
    }

    let response: Response;
    try {
        response = await fetch(`${baseUrl}${path}`, {
            method: options.method || "GET",
            headers,
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
            cache: "no-store",
        });
    } catch {
        throw new ApiError(0, "NETWORK_ERROR");
    }

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
        const code =
            payload && typeof payload === "object" && "error" in payload &&
                typeof payload.error === "string"
                ? payload.error
                : "API_ERROR";
        throw new ApiError(response.status, code);
    }
    if (payload === null) throw new ApiError(response.status, "INVALID_RESPONSE");
    return payload as T;
}
