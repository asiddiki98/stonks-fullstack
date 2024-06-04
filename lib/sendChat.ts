export function sendWebSocketMessage(
  userId: any,
  username: any,
  message: any,
  streamerId: any
) {
  const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  const ws = new WebSocket(`${webSocketUrl}?identifier=${userId}`);

  ws.onopen = () => {
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

    ws.close();
  };
}
