import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        `${origin}/login?message=Could not authenticate user`
      );
    }

    const { user } = data.session;
    // Check if user profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile.username === null) {
      return NextResponse.redirect(`${origin}/complete-signup`);
    } else {
      // update profile.is_online to true if they are loggin in with google

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return NextResponse.redirect(
          `${origin}/login?message=Could not update user profile`
        );
      }
    }
  }

  // URL to redirect to after sign-up process completes
  return NextResponse.redirect(`${origin}/`);
}
