import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonStyleProps = {
    variant?: "primary" | "text";
    size?: "default" | "large";
    className?: string;
};

type ActionButtonProps = ButtonStyleProps & ComponentProps<"button"> & { href?: never };
type LinkButtonProps = ButtonStyleProps & ComponentProps<typeof Link> & { href: string };

export type ButtonProps = ActionButtonProps | LinkButtonProps;

function buttonClassName(variant: ButtonStyleProps["variant"], size: ButtonStyleProps["size"], className: string) {
    const style = variant === "text"
        ? "text-(--brand) hover:underline disabled:opacity-60"
        : "rounded-xl bg-(--brand) text-white hover:bg-(--brand-hover) disabled:opacity-60 hover:cursor-pointer";
    const padding = variant === "text" ? "" : size === "large" ? "px-8 py-3" : "px-5 py-3";

    return `${style} ${padding} ${className}`.trim();
}

export function Button(props: ButtonProps) {
    if (props.href !== undefined) {
        const { variant = "primary", size = "default", className = "", ...linkProps } = props;
        return <Link {...linkProps} className={buttonClassName(variant, size, className)} />;
    }

    const { variant = "primary", size = "default", className = "", ...buttonProps } = props;
    return <button {...buttonProps} className={buttonClassName(variant, size, className)} />;
}
