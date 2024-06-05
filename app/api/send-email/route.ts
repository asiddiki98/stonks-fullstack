// send-email.ts
import { sendEmail } from "@/utils/sendEmail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, email } = await request.json();

  try {
    // Send email to each follower's email address
    for (const emailAddress of email) {
      const message = ` ${username} has started streaming. Check it out!`;
      await sendEmail(emailAddress, "New Stream Alert", message);
    }

    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}
