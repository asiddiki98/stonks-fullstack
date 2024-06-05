"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default function ProviderSignInButton({
  provider,
  children,
}: {
  provider: Provider;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const signInWithProvider = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <button
      className="bg-blue-500 rounded-md px-4 py-2 text-foreground mb-2"
      onClick={signInWithProvider}
      disabled={loading}
    >
      {children}
    </button>
  );
}
