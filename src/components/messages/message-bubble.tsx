/**
 * Composent représentant une bulle de message dans la messagerie.
 *
 * @param outgoing Indique si le message est sortant (envoyé par l'utilisateur) ou entrant (reçu).
 *
 * @returns Un composant affichant une bulle de message avec l'alignement et le style appropriés selon qu'il s'agit d'un message sortant ou entrant.
 */
export function MessageBubble({ outgoing }: { outgoing: boolean }) {
    return (
        <div className={`flex items-start gap-2 ${outgoing ? "flex-row-reverse" : ""}`}>
            <span className="mt-1 size-10 shrink-0 rounded-lg bg-[#575757]" aria-hidden="true" />
            <div className={`flex min-w-0 max-w-[calc(100%-3rem)] flex-col gap-3 ${outgoing ? "items-end" : "items-start"}`}>
                <p className="text-xs text-[#62666a]">Utilisateur <span aria-hidden="true">●</span> 11:04pm</p>
                <p className={`max-w-md rounded-3xl px-5 py-4 text-base leading-6 shadow-sm lg:text-base ${outgoing ? "rounded-tr-sm bg-(--brand-hover) text-white" : "rounded-tl-sm border border-[#e9ebef] bg-white"}`}>
                    Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?
                </p>
            </div>
        </div>
    );
}