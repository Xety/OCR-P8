"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError, apiRequest } from "@/lib/api/api";
import { createSession, deleteSession } from "@/lib/auth/session";
import {
    authFieldErrors,
    loginSchema,
    signupSchema,
    type AuthState,
} from "@/lib/auth/validation";

const responseSchema = z.object({ token: z.string().min(1) });

function values(formData: FormData): AuthState["values"] {
    const text = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : undefined;
    };
    return {
        email: text("email"),
        lastName: text("lastName"),
        firstName: text("firstName"),
        role: text("role"),
    };
}

function actionError(error: unknown, mode: "login" | "signup", submitted: AuthState["values"]): AuthState {
    if (error instanceof ApiError) {
        if (mode === "login" && error.status === 401) {
            return { message: "Adresse email ou mot de passe incorrect.", values: submitted };
        }
        if (mode === "signup" && error.status === 409) {
            return {
                fieldErrors: { email: "Cette adresse email est déjà utilisée." },
                values: submitted,
            };
        }
        if (error.status === 0 || error.status >= 500) {
            return { message: "Le service est momentanément indisponible. Réessayez plus tard.", values: submitted };
        }
    }
    return { message: "Une erreur est survenue. Veuillez réessayer.", values: submitted };
}

export async function loginAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
    const submitted = values(formData);
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { fieldErrors: authFieldErrors(parsed.error), values: submitted };

    try {
        const response = await apiRequest<unknown>("/auth/login", {
            method: "POST",
            body: parsed.data,
        });
        const auth = responseSchema.parse(response);
        await createSession(auth.token);
    } catch (error) {
        return actionError(error, "login", submitted);
    }
    redirect("/");
}

export async function signupAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
    const submitted = values(formData);
    const parsed = signupSchema.safeParse({
        lastName: formData.get("lastName"),
        firstName: formData.get("firstName"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role") ?? "client",
        terms: formData.get("terms"),
    });
    if (!parsed.success) return { fieldErrors: authFieldErrors(parsed.error), values: submitted };

    try {
        const { firstName, lastName, email, password, role } = parsed.data;
        const response = await apiRequest<unknown>("/auth/register", {
            method: "POST",
            body: { name: `${firstName} ${lastName}`, email, password, role },
        });
        const auth = responseSchema.parse(response);
        await createSession(auth.token);
    } catch (error) {
        return actionError(error, "signup", submitted);
    }
    redirect("/");
}

export async function logoutAction() {
    await deleteSession();
    redirect("/");
}
