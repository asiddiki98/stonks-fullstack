import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendEmail } from "@/utils/sendEmail";

const webSocketUrl: any = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");
  const username = searchParams.get("username");

  // get all followers

  const { data: followers } = await supabase
    .from("follows")
    .select("*")
    .eq("follows_id", userId);

  // get the followers profiles
  if (followers && followers.length > 0) {
    const followerIds = followers.map((follower) => follower.follower_id);
    const { data: followerProfiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", followerIds);

    // filter out the followers that are online and have push notifications enabled
    if (followerProfiles && followerProfiles.length > 0) {
      const onlineFollowers = followerProfiles
        .filter(
          (follower) =>
            follower.is_online && follower.notification_preferences.push
        )
        .map((follower) => follower.id);

      const offlineFollowers = followerProfiles.filter(
        (follower) =>
          !follower.is_online && follower.notification_preferences.email
      );

      // push notifications to the online followers
      console.log("onlineFollowers", onlineFollowers);

      if (onlineFollowers.length > 0) {
        const ws = new WebSocket(webSocketUrl);
        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              action: "sendmessage",
              message: "hello, everyone!",
              userId: userId,
              type: "STREAM_START",
              username: username,
              followerIds: onlineFollowers,
            })
          );
        };
      }

      // send email to the offline followers
      console.log("offlineFollowers", offlineFollowers);
      if (offlineFollowers.length > 0) {
        for (const follower of offlineFollowers) {
          const message = `Hello ${follower.username}, ${username} has started streaming. Check it out!`;
          await sendEmail(follower.email, "New Stream Alert", message);
        }
      }
    }
  }
  // notify followers

  return NextResponse.json({ message: "Followers notified" });
}
