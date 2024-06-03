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
      .eq("id", user.id);

    // if the user does not have a profile, create one
    if (!profile || profile.length === 0) {
      // Create or update user profile
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id, // Use the user's auth UID as the primary key
        email: user.email,
        username: null,
        notification_preferences: {}, // Default notification preferences
        is_streaming: false, // Default streaming status
        is_online: true, // Default online status
      });

      if (insertError) {
        console.error("Error upserting user profile:", insertError);
        return NextResponse.redirect(
          `${origin}/login?message=Could not create user profile`
        );
      }
    }
  }

  // URL to redirect to after sign-up process completes
  return NextResponse.redirect(`${origin}/protected`);
}
