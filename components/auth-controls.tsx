"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

/* Auth controls for the site header (client boundary).
   Signed out: Sign in (text) + Sign up (primary, md).
   Signed in: UserButton avatar menu. */

export function AuthControls() {
  return (
    <span className="inline-flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton>
          <button
            type="button"
            className="type-body cursor-pointer font-medium whitespace-nowrap text-neutral-900 transition-colors hover:text-primary-500"
          >
            Sign in
          </button>
        </SignInButton>
        <SignUpButton>
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md bg-primary-500 px-3 text-body font-medium whitespace-nowrap text-white transition-colors hover:bg-primary-400"
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </span>
  );
}
