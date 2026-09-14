import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/auth/user";

export default async function LoginPage() {
    if (await getCurrentUser()) redirect("/");
    return (
        <AuthCard
            title="Heureux de vous revoir"
            description="Connectez-vous pour retrouver vos réservations, vos annonces et tout ce qui rend vos séjours uniques."
        >
            <LoginForm />
        </AuthCard>
    );
}
