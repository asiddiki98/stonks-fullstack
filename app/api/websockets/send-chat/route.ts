import { NextResponse } from "next/server";

const webSocketUrl: any = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export async function POST(req: Request) {
  const { userId, username, message, streamerId } = await req.json();

  if (!userId || !username || !message || !streamerId) {
    console.log("Missing required fields");
  }

  // Connect to the WebSocket server if not already connected
  const ws = new WebSocket(webSocketUrl);

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
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return NextResponse.json({ message: "Message sent" });
}
