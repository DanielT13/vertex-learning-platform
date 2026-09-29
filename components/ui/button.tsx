import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* §07 Buttons
   Height 44px lg / 36px md · radius 12px · padding 0 16px lg / 0 12px md
   Inter Medium 14–16px. Disabled keeps layout and drops opacity.
   Pure presentational: no "use client" needed.
*/

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
export type ButtonSize = "lg" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "rounded-md transition-colors cursor-pointer " +
  "disabled:cursor-not-allowed disabled:opacity-45 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-400 shadow-sm",
  secondary:
    "border border-primary-500 text-primary-500 bg-white hover:bg-primary-100",
  tertiary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  text: "text-primary-500 hover:text-primary-400 px-0",
};

const sizes: Record<ButtonSize, string> = {
  // 44px height, 16px horizontal padding
  lg: "h-11 px-4 text-body-lg",
  // 36px height, 12px horizontal padding
  md: "h-9 px-3 text-body",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
