"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import type { AuthState } from "@/lib/auth/validation";

const initialState: AuthState = {};

export function LoginForm() {
    const [state, action, pending] = useActionState(loginAction, initialState);
    const [forgotMessage, setForgotMessage] = useState(false);

    return (
        <form action={action} noValidate className="mx-auto mt-12 max-w-107.5 space-y-7">
            <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} error={state.fieldErrors?.email} />
            </div>
            <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" autoComplete="current-password" error={state.fieldErrors?.password} />
            </div>
            {state.message && <p role="alert" className="text-center text-sm text-red-700">{state.message}</p>}
            <div className="space-y-5 pt-4 text-center">
                <Button type="submit" disabled={pending} className="mx-auto block w-full max-w-68.75">
                    {pending ? "Connexion…" : "Se connecter"}
                </Button>
                <Button type="button" variant="text" onClick={() => setForgotMessage(true)}>Mot de passe oublié</Button>
                {forgotMessage && <p role="status" className="text-sm">La réinitialisation du mot de passe sera disponible dans un prochain lot.</p>}
                <p className="text-[#97391f]">Pas encore de compte ? <Link href="/signup" className="font-medium hover:underline">Inscrivez-vous</Link></p>
            </div>
        </form>
    );
}

export function SignupForm() {
    const [state, action, pending] = useActionState(signupAction, initialState);

    return (
        <form action={action} noValidate className="mx-auto mt-12 max-w-107.5 space-y-6">
            <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" autoComplete="family-name" defaultValue={state.values?.lastName} error={state.fieldErrors?.lastName} />
            </div>
            <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" name="firstName" autoComplete="given-name" defaultValue={state.values?.firstName} error={state.fieldErrors?.firstName} />
            </div>
            <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} error={state.fieldErrors?.email} />
            </div>
            <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" error={state.fieldErrors?.password} />
            </div>
            <fieldset aria-describedby={state.fieldErrors?.role ? "role-error" : undefined} className="flex flex-wrap gap-x-7 gap-y-2">
                <legend className="mb-2 font-medium">Je suis</legend>
                <label className="inline-flex items-center gap-2"><input type="radio" name="role" value="client" defaultChecked={!state.values?.role || state.values.role === "client"} /> Voyageur</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="role" value="owner" defaultChecked={state.values?.role === "owner"} /> Hôte</label>
                {state.fieldErrors?.role && <span id="role-error" role="alert" className="w-full text-sm text-red-700">{state.fieldErrors.role}</span>}
            </fieldset>
            <div>
                <label className="flex items-start gap-3 text-sm text-[#555a60] sm:text-base">
                    <input type="checkbox" name="terms" aria-invalid={Boolean(state.fieldErrors?.terms)} aria-describedby={state.fieldErrors?.terms ? "terms-error" : undefined} className="mt-1 accent-[#97391f]" />
                    <span>J’accepte les conditions générales d’utilisation</span>
                </label>
                {state.fieldErrors?.terms && <p id="terms-error" role="alert" className="mt-1 text-sm text-red-700">{state.fieldErrors.terms}</p>}
            </div>
            {state.message && <p role="alert" className="text-center text-sm text-red-700">{state.message}</p>}
            <div className="space-y-5 pt-2 text-center">
                <Button type="submit" disabled={pending} className="mx-auto block w-full max-w-68.75">
                    {pending ? "Inscription…" : "S’inscrire"}
                </Button>
                <p className="text-(--brand)">Déjà membre ? <Link href="/login" className="font-medium hover:underline">Se connecter</Link></p>
            </div>
        </form>
    );
}
