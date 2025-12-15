import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import dayjs from "dayjs";

// Connect to backend
const socket = io("http://localhost:5000");

export default function GroupChat({ name, rollno, role }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!name || !rollno || !role) return;

    // Join chat
    socket.emit("join", { name, rollno, role });

    // Online users
    if (role === "student") {
      socket.on("onlineStudents", (users) => setOnlineUsers(users));
      socket.on("chatHistory", (history) => setMessages(history));
      socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    } else if (role === "driver") {
      socket.on("onlineDrivers", (users) => setOnlineUsers(users));
      socket.on("chatHistory", (history) => setMessages(history));
      socket.on("receiveDriverMessage", (msg) => setMessages((prev) => [...prev, msg]));
    }

    // Cleanup
    return () => {
      socket.off("onlineStudents");
      socket.off("onlineDrivers");
      socket.off("chatHistory");
      socket.off("receiveMessage");
      socket.off("receiveDriverMessage");
    };
  }, [name, rollno, role]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div className="bg-white flex flex-col p-4 rounded-lg shadow-md w-full max-w-md h-[500px]">
      <h2 className="text-xl font-bold mb-2">
        Online {role === "driver" ? "Drivers" : "Students"} ({onlineUsers.length})
      </h2>

      {/* Online Users */}
      <ul className="flex space-x-2 mb-4 overflow-x-auto">
        {onlineUsers.map((u) => (
          <li key={u.rollno} className="bg-green-200 px-3 py-1 rounded-full text-sm">
            {u.name}
          </li>
        ))}
      </ul>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-2 p-2 border rounded bg-gray-50">
        {messages.map((msg) => {
          const msgId = msg._id || msg.timestamp; // fallback
          const isMe = msg.rollno === rollno || msg.vehicleNo === rollno;
          return (
            <div key={msgId} className={`flex flex-col my-1 ${isMe ? "items-end" : "items-start"}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs break-words ${isMe ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}>
                {!isMe && <p className="font-semibold text-sm">{msg.name}</p>}
                <p>{msg.message}</p>
                <span className="text-xs text-gray-600 mt-1 block text-right">
                  {dayjs(msg.timestamp).format("HH:mm")}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex mt-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded-l-lg focus:outline-none"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
}
