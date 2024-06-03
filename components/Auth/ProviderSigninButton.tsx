"use client";

import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default function ProviderSignInButton({
  provider,
  children,
}: {
  provider: Provider;
  children: React.ReactNode;
}) {
  const signInWithProvider = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate with provider");
    }
  };

  return (
    <button
      className="bg-blue-500 rounded-md px-4 py-2 text-foreground mb-2"
      onClick={signInWithProvider}
    >
      {children}
    </button>
  );
}
