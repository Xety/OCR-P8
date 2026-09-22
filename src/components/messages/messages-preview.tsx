"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageBubble } from "./message-bubble";

// Liste des conversations simulées et des messages pour l'aperçu de la messagerie.
const conversations = Array.from({ length: 8 }, (_, index) => ({ id: index + 1, unread: index < 3 }));
const messages = ["incoming", "incoming", "outgoing", "date", "incoming", "outgoing", "incoming"] as const;

export function MessagesPreview() {
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const showThread = selectedConversation !== null;

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col bg-background lg:min-h-0 lg:flex-row lg:pt-24" data-mobile-view={showThread ? "thread" : "list"}>
            <section aria-label="Conversations" className={`${showThread ? "hidden" : "flex"} min-h-0 flex-1 flex-col bg-white lg:flex lg:max-w-[35.5%] lg:border-r lg:border-[#eff0f2]`}>
                <div className="px-3 pt-10 lg:px-6">
                    <Link href="/" className="inline-flex rounded-2xl bg-[#f4f5f6] px-5 py-3 text-[#4b4e51] hover:bg-[#e9eaec]">
                        ← Retour
                    </Link>
                    <h1 className="mt-10 px-1 text-4xl font-semibold lg:mt-11 lg:text-5xl">Messages</h1>
                </div>

                <ul className="mt-8 lg:min-h-0 lg:overflow-y-auto">
                    {conversations.map(({ id, unread }) => (
                        <li key={id}>
                            <button
                                type="button"
                                onClick={() => setSelectedConversation(id)}
                                aria-label={`Ouvrir la conversation ${id} avec Utilisateur`}
                                aria-current={selectedConversation === id || (selectedConversation === null && id === 1) ? "true" : undefined}
                                className={`flex w-full items-center gap-5 border-b border-[#eff0f2] px-3 py-3 text-left hover:bg-[#fffaf8] lg:px-6 ${selectedConversation === id || (selectedConversation === null && id === 1) ? "bg-[#fffcfa]" : ""}`}
                            >
                                <span className="size-15 shrink-0 rounded-xl bg-[#f4f5f6] lg:size-17" aria-hidden="true" />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-lg font-medium lg:text-xl">Utilisateur</span>
                                    <span className="mt-1 block truncate text-sm text-[#5d6266] lg:text-base">Bonjour, votre appartement est-il disp...</span>
                                </span>
                                <span className="flex shrink-0 flex-col items-end gap-5 text-sm text-[#555a5e]">
                                    <span>11:04 am</span>
                                    {unread && <span className="size-2 rounded-full bg-(--brand)" aria-label="Non lu" />}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section aria-label="Conversation" className={`${showThread ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex`}>
                <div className="bg-white px-3 pt-10 pb-5 lg:hidden">
                    <button type="button" onClick={() => setSelectedConversation(null)} className="rounded-2xl bg-[#f4f5f6] px-5 py-3 text-[#4b4e51] hover:bg-[#e9eaec]">
                        ← Retour
                    </button>
                </div>

                <div className="flex-1 space-y-14 px-3 pt-12 pb-14 lg:min-h-0 lg:overflow-y-auto lg:px-16 lg:pt-14">
                    {messages.map((kind, index) => kind === "date" ? (
                        <div key={index} className="flex items-center gap-3 text-xs text-[#64686c]">
                            <span className="h-px flex-1 bg-[#9c9c9c]" />
                            <span>03 Septembre 2025</span>
                            <span className="h-px flex-1 bg-[#9c9c9c]" />
                        </div>
                    ) : (
                        <MessageBubble key={index} outgoing={kind === "outgoing"} />
                    ))}
                </div>

                <div className="border-t border-[#eff0f2] bg-white px-3 py-6 lg:px-12 lg:py-8">
                    <div className="flex min-h-16 items-end gap-3 rounded-2xl border border-[#e9ebef] px-5 py-3 lg:min-h-36 lg:px-6">
                        <textarea
                            aria-label="Votre message"
                            placeholder="Envoyer un message"
                            rows={1}
                            className="min-w-0 flex-1 self-stretch resize-none placeholder:text-[#5d6266]"
                        />
                        <button type="button" disabled aria-label="Envoi de messages indisponible pour le moment" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--brand) text-white lg:size-12">
                            ↑
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
