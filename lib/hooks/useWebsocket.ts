// In your Profile component or a separate file for WebSocket handling
import { useEffect, useState } from "react";

export default function useWebSocket(url: any, onMessage: any) {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket: any = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = onMessage;

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url, onMessage]);

  return ws;
}
