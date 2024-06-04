import { NextResponse } from "next/server";
const webSocketUrl: any = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export async function GET(req: Request) {
  // const { userId, username, message, streamerId } = await req.json();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const username = searchParams.get("username");
  const message = searchParams.get("message");
  const streamerId = searchParams.get("streamerId");

  console.log("userId", userId);

  if (!userId || !username || !message || !streamerId) {
    console.log("Missing required fields");
  }

  // Connect to the WebSocket server if not already connected
  const ws = new WebSocket(`${webSocketUrl}?identifier=${userId}`);
  ws.onopen = () => {
    // Send the chat message to the WebSocket server
    ws.send(
      JSON.stringify({
        action: "sendmessage",
        type: "CHAT_MESSAGE",
        userId: userId,
        username: username,
        streamerId: streamerId,
        message: message,
      })
    );

    // Close the WebSocket connection after sending the message
    ws.close();
  };

  return NextResponse.json({ message: "Message sent" });
}
