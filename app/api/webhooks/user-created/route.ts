import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Validate the shared secret
  try {
    // Parse the incoming request body
    const { event, payload } = await request.json();

    // Check if the event type is user created
    if (event === "USER_CREATED") {
      const user = payload;

      console.log("User created:", user);

      // Create a new profile for the user
      //   const { error } = await supabase.from("profiles").insert({
      //     id: user.id,
      //     email: user.email,
      //     username: user.email.split("@")[0], // Set a default username based on email
      //     notification_preferences: {
      //       email: true,
      //       push: true,
      //     },
      //     is_streaming: false,
      //   });

      //   if (error) {
      //     console.error("Error creating profile:", error);
      //     return NextResponse.json(
      //       { error: "Error creating profile" },
      //       { status: 500 }
      //     );
      //   }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
