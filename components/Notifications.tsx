"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import useWebSocket from "@/lib/hooks/useWebsocket";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const ws = useWebSocket();

  const messages = useSelector(
    (state: any) => state.notification.notifications
  );

  const openProfile = (id: any) => {
    // Function to open profile
    window.location.href = `/profile/${id}`;
  };

  // Function to handle incoming WebSocket messages

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
        <ul className=" absolute top-12 right-0 min-w-[200px]  border rounded bg-blue-300">
          {messages.map((msg: any, index: any) => (
            <li
              onClick={() => openProfile(msg.userId)}
              className="py-2 border-b  px-4 cursor-pointer"
              key={index}
            >
              <small>{msg.username} started streaming</small>
            </li>
          ))}

          {messages.length === 0 && (
            <li className="py-2 border-b  px-4">
              <small>No new notifications</small>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
