import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favorites/favorites-grid";
import { getProperties } from "@/lib/properties/properties";
import type { PropertySummary } from "@/lib/properties/validation";

export const metadata: Metadata = {
    title: "Favoris | Kasa",
};

export default async function FavoritesPage() {
    let properties: PropertySummary[] = [];
    let loadingError = false;

    try {
        properties = await getProperties();
    } catch {
        loadingError = true;
    }

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-3.5 pt-24 pb-24">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-(--brand) lg:text-[40px]">Vos favoris</h1>
                <p className="mx-auto mt-4 max-w-160 text-base leading-6 lg:text-[17px]">
                    <span className="block">Retrouvez ici tous les logements que vous avez aimés.</span>
                    <span className="block">Prêts à réserver ? Un simple clic et votre prochain séjour est en route.</span>
                </p>
            </header>

            {loadingError ? (
                <p className="mt-12 rounded-xl bg-white px-6 py-12 text-center" role="alert">
                    Les logements sont momentanément indisponibles. Veuillez réessayer plus tard.
                </p>
            ) : (
                <FavoritesGrid properties={properties} />
            )}
        </main>
    );
}
