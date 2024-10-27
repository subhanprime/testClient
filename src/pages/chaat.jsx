import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { serverAdd } from "../config/index";

const socket = io(serverAdd);

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server:", socket.id);
    });

    socket.on("chat message", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("connect");
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        senderId: socketId,
      };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat Room</h1>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-4 overflow-y-scroll h-80">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-lg ${
              msg.senderId === socketId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
