import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "@/redux/chatSlice";
import { addNotification } from "@/redux/notificationsSlice";
import { createClient } from "@/utils/supabase/client";

export default function useWebSocket() {
  const [ws, setWs] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch();
  const supabase = createClient();
  const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?identifier=hook`;

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      fetchUser();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);
      handleIncomingMessage(message);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user || { id: "public" });
  };

  const handleIncomingMessage = (message: any) => {
    console.log(user?.id);
    if (
      message.type === "STREAM_START" &&
      message.followerIds.includes(user?.id)
    ) {
      dispatch(addNotification(message));
    }

    const profileId = window.location.pathname.split("/")[2];
    if (message.type === "CHAT_MESSAGE" && message.streamerId === profileId) {
      dispatch(addMessage(message));
    }
  };

  return ws;
}
