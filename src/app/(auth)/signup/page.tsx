import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/auth/user";

export default async function SignupPage() {
    if (await getCurrentUser()) redirect("/");
    return (
        <AuthCard
            title="Rejoignez la communauté Kasa"
            description="Créez votre compte et commencez à voyager autrement : réservez des logements uniques, découvrez de nouvelles destinations et partagez vos propres lieux avec d’autres voyageurs."
        >
            <SignupForm />
        </AuthCard>
    );
}
