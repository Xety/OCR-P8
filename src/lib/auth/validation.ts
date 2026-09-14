import { z } from "zod";

const email = z
    .string({ error: "L’adresse email est obligatoire." })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Saisissez une adresse email valide." }));

const password = z
    .string({ error: "Le mot de passe est obligatoire." })
    .min(1, "Le mot de passe est obligatoire.");

const name = (label: string) =>
    z
        .string({ error: `${label} est obligatoire.` })
        .trim()
        .min(1, `${label} est obligatoire.`);

export const loginSchema = z.object({ email, password });

export const signupSchema = loginSchema.extend({
    lastName: name("Le nom"),
    firstName: name("Le prénom"),
    password: password.min(6, "Le mot de passe doit contenir au moins 6 caractères."),
    role: z.enum(["client", "owner"], {
        error: "Choisissez Voyageur ou Hôte.",
    }),
    terms: z.literal("on", {
        error: "Vous devez accepter les conditions générales d’utilisation.",
    }),
});

export type AuthField = "email" | "password" | "lastName" | "firstName" | "role" | "terms";

export type AuthState = {
    fieldErrors?: Partial<Record<AuthField, string>>;
    message?: string;
    values?: { email?: string; lastName?: string; firstName?: string; role?: string };
};

export function authFieldErrors(error: z.ZodError): AuthState["fieldErrors"] {
    const fields = z.flattenError(error).fieldErrors as Partial<Record<AuthField, string[]>>;

    return {
        email: fields.email?.[0],
        password: fields.password?.[0],
        lastName: fields.lastName?.[0],
        firstName: fields.firstName?.[0],
        role: fields.role?.[0],
        terms: fields.terms?.[0],
    };
}
