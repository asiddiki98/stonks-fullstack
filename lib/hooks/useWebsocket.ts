// In your Profile component or a separate file for WebSocket handling
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "@/redux/chatSlice";
import { addNotification } from "@/redux/notificationsSlice";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";

export default function useWebSocket() {
  const [ws, setWs] = useState(null);
  const [user, setUser] = useState<any>(null);
  const params = useParams();
  const { profileId } = params;

  const dispatch = useDispatch();
  const supabase = createClient();
  const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`;
  useEffect(() => {
    const socket: any = new WebSocket(url);
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user || { id: "public" });
    };

    fetchUser();

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data);

      if (
        message.type === "STREAM_START" &&
        message.followerIds.some((id: string) => id === user?.id)
      ) {
        dispatch(addNotification(message));
      }

      if (message.type === "CHAT_MESSAGE" && message.streamerId === profileId) {
        console.log("Message received:", message);
        dispatch(addMessage(message));
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user?.id]);

  return ws;
}
