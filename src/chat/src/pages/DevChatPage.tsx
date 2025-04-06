
import React from "react";
import { ChatClient } from "@/chat-client";

export default function DevChatPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat Client Development Testing</h1>
      <div className="h-[calc(100vh-8rem)]">
        <ChatClient />
      </div>
    </div>
  );
}
