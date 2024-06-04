"use client";
import { useState, useEffect, useCallback } from "react";
import useWebSocket from "@/lib/hooks/useWebsocket";
import { createClient } from "@/utils/supabase/client";
import { Icon } from "@iconify/react";

export default function ChatBox({ streamerProfile }: { streamerProfile: any }) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      setUser(profile || { id: "public" });
    };

    fetchUser();
  }, []);

  //   const handleMessage = (event: MessageEvent) => {
  //     const message = JSON.parse(event.data);
  //     if (message.type === "CHAT_MESSAGE") {
  //       if (message.streamerId === streamerProfile.id) {
  //         console.log("message", message);
  //         setMessages((prev) => [...prev, message]);
  //       }
  //     }
  //   };

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "CHAT_MESSAGE") {
        if (message.streamerId === streamerProfile.id) {
          console.log("message", message);
          setMessages((prev) => [...prev, message]);
        }
      }
    },
    [streamerProfile.id]
  );
  const ws = useWebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL, handleMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.id === "public" || !user) {
      window.location.href = "/login";
    }
    if (input.trim()) {
      setInput("");
      const body = {
        userId: user.id,
        username: user.username,
        streamerId: streamerProfile.id,
        message: input,
      };
      console.log("body", body);
      await fetch("/api/websockets/send-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    }
  };

  return (
    <div className="border rounded p-2 grid-rows-layout ">
      <h1 className="flex w-full justify-start gap-2">
        <Icon icon="majesticons:chat" width="1.5em" height="1.5rem" />
        Live Chat
      </h1>
      <div className="relative overflow-y-scroll">
        <ul className="flex flex-col space-y-2 p-4 overflow-y-scroll">
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </li>
          ))}

          {/* <p>hello</p> */}
        </ul>
      </div>
      <form className="flex  gap-2" onSubmit={handleSubmit}>
        <input
          className="rounded-md p-2 bg-inherit border"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
