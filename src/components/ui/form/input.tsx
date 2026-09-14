import type { ComponentProps } from "react";

type InputProps = Omit<ComponentProps<"input">, "id"> & {
    id: string;
    error?: string;
};

export function Input({ id, error, className, ...props }: InputProps) {
    const errorId = `${id}-error`;
    const describedBy = [props["aria-describedby"], error && errorId].filter(Boolean).join(" ") || undefined;

    return (
        <>
            <input
                {...props}
                id={id}
                aria-invalid={error ? true : props["aria-invalid"]}
                aria-describedby={describedBy}
                className={className || "h-12 w-full rounded-md border border-[#e7e9ef] bg-white px-3 outline-none focus-visible:border-[#97391f] focus-visible:ring-2 focus-visible:ring-[#97391f]/20"}
            />
            {error && <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
        </>
    );
}
