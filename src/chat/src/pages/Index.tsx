
import React from "react";
import { DockableChat } from "@/chat-client/components/DockableChat";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
        <p className="text-xl text-gray-600">Your dockable chat client is available in the bottom right corner!</p>
        <p className="text-lg text-gray-500 mt-4">Click on the chat icon to open it.</p>
      </div>
      
      {/* The dockable chat client */}
      <DockableChat position="bottom-right" initialOpen={false} />
    </div>
  );
};

export default Index;
