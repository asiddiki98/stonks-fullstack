"use client";

import useWebSocket from "@/lib/hooks/useWebsocket";
import { useState, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";

export default function Notifications() {
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const supabase = createClient();

  // Function to handle incoming WebSocket messages
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const message: any = JSON.parse(event.data);

      if (
        message.type === "STREAM_START" &&
        message.followerIds.some((id: string) => id === user?.id)
      ) {
        console.log("Stream started:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    },
    [user?.id]
  );

  const ws = useWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?userId=${user?.id}`,
    handleMessage
  );
  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user || { id: "public" });
    };

    fetchUser();
  }, []);

  return (
    <div className=" relative">
      <h1 className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <Icon icon="majesticons:bell" width="1.5em" height="1.5rem" />
        {messages.length > 0 && (
          <span className=" flex absolute top-[-12px] right-[-12px] bg-red-400  rounded-[50%] h-6 w-6 justify-center">
            {messages.length}
          </span>
        )}
      </h1>

      {open && (
        <ul className=" absolute top-12 right-0 min-w-[200px]  border rounded">
          {messages.map((msg, index) => (
            <li className="py-2 border-b  px-4" key={index}>
              <small>{msg.username} started streaming</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
