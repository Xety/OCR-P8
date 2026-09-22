import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessagesPreview } from "@/components/messages/messages-preview";
import { getCurrentUser } from "@/lib/auth/user";

export const metadata: Metadata = {
    title: "Messages | Kasa",
};

export default async function MessagesPage() {
    if (!(await getCurrentUser())) {
        redirect("/login");
    }

    return (
        <MessagesPreview />
    );
}
