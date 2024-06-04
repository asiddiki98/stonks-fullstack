"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { sendWebSocketMessage } from "@/lib/sendChat";

export default function ChatBox({ streamerProfile }: { streamerProfile: any }) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const [input, setInput] = useState("");
  const messages = useSelector((state: any) => state.chat.messages);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.id === "public" || !user) {
      window.location.href = "/login";
    }
    if (input.trim()) {
      setInput("");
      //   const body = {
      //     userId: user.id,
      //     username: user.username,
      //     streamerId: streamerProfile.id,
      //     message: input,
      //   };
      sendWebSocketMessage(user.id, user.username, input, streamerProfile.id);
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
          {messages.map((msg: any, index: any) => (
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
