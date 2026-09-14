import type { ComponentProps } from "react";

export function Label({ className, ...props }: ComponentProps<"label">) {
    return <label {...props} className={className || "mb-1 block font-medium"} />;
}
