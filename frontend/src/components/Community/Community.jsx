import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

export const Community = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Establish Socket.IO connection on component mount
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Connected to backend Socket.IO");
    });

    // Comprehensive message handling
    socketRef.current.on("chat-message", (incomingMessage) => {
      console.log("Received message:", incomingMessage);
      
      if (Array.isArray(incomingMessage)) {
        // Initial load of messages
        setMessages(incomingMessage);
      } else {
        // Append new single message
        setMessages(prevMessages => {
          // Check if message already exists to prevent duplicates
          const messageExists = prevMessages.some(msg => 
            msg._id === incomingMessage._id || 
            (msg.text === incomingMessage.text && msg.sender === incomingMessage.sender)
          );
          
          return messageExists 
            ? prevMessages 
            : [...prevMessages, incomingMessage];
        });
      }
    });

    // Error handling
    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Clean up the socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to the latest message when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const messageData = {
        sender: "Aman",
        text: newMessage,
        dateTime: new Date().toISOString() // Convert to ISO string
      };

      // Emit message to server
      socketRef.current.emit("message", messageData);

      // Clear input
      setNewMessage("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/70 backdrop-blur-md shadow-lg p-4 flex justify-between items-center border-b border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <MessageCircle className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-indigo-700 tracking-wide">
            Community Chat
          </h2>
        </div>
      </motion.div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
        {messages.map((message, index) => (
          <motion.div
            key={message._id || `message-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`flex flex-col ${
              message.sender === "You" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`
                max-w-[70%] p-4 rounded-3xl shadow-lg transition-all duration-300
                ${
                  message.sender === "You"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }
              `}
            >
              <div className="font-semibold text-sm">{message.sender}</div>
              <div className="text-sm">{message.text}</div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === "You" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {new Date(message.dateTime).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} /> {/* For scrolling to the bottom */}
      </div>

      {/* Message Input */}
      <div className="bg-white/70 backdrop-blur-md p-4 flex items-center space-x-2 border-t border-gray-200 shadow-inner">
        <motion.input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="
            flex-grow p-3 rounded-full
            bg-blue-50 border border-blue-200
            focus:bg-white focus:border-blue-400
            shadow-sm transition-all duration-300
          "
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSendMessage}
          className="
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white p-3 rounded-full
            shadow-lg hover:shadow-xl
            transition-all duration-300
          "
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default Community;