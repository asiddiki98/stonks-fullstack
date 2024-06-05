import { createClient } from "@/utils/supabase/client";

export default async function sendNotification(userId: any, username: any) {
  const supabase = createClient();

  const { data: followers, error } = await supabase
    .from("follows")
    .select("*")
    .eq("follows_id", userId);

  if (error) {
    console.error("Error fetching followers:", error);
    return;
  }

  if (followers && followers.length > 0) {
    const followerIds = followers.map((follower) => follower.follower_id);
    const { data: followerProfiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", followerIds);

    if (profileError) {
      console.error("Error fetching follower profiles:", profileError);
      return;
    }

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

    if (onlineFollowers.length > 0) {
      const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
      const ws = new WebSocket(`${webSocketUrl}?identifier=${userId}`);
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

    if (offlineFollowers.length > 0) {
      // send to handle email route
      fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({
          userId,
          username,
          email: offlineFollowers.map((follower) => follower.email),
        }),
      });
    }

    // Handle sending email to offline followers if needed
  }
}
