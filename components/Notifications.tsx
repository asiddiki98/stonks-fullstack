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
        <ul className=" absolute top-12 right-0 min-w-[200px]  border rounded">
          {messages.map((msg: any, index: any) => (
            <li className="py-2 border-b  px-4" key={index}>
              <small>{msg.username} started streaming</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
