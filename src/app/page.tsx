import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/user";

export default async function Home() {
    const user = await getCurrentUser();
    return (
        <main className="flex flex-1 items-center justify-center px-4 py-16">
            <section className="w-full max-w-222 rounded-xl border border-[#e7e9ef] bg-white px-5 py-16 text-center sm:px-12">
                <h1 className="text-3xl font-bold text-[#92391f] sm:text-4xl">{user ? `Bienvenue, ${user.name}` : "Bienvenue chez Kasa"}</h1>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-7">
                    {user ? "Votre espace est prêt. Les logements et vos séjours arriveront dans un prochain lot." : "Connectez-vous pour retrouver vos séjours et découvrir bientôt nos logements."}
                </p>
                {user ? (
                    <form action={logoutAction} className="mt-8">
                        <Button type="submit" size="large">Se déconnecter</Button>
                    </form>
                ) : (
                    <Button href="/login" size="large" className="mt-8 inline-flex">Se connecter</Button>
                )}
            </section>
        </main>
    );
}
