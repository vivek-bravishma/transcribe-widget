import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./style.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const updatedMessages = [...messages, { text: newMessage, sender: "You" }];
    setMessages(updatedMessages);

    setNewMessage("");
  };

  useEffect(() => {
    const socket = io("https://transcribe-api.lab.bravishma.com");

    socket.on("data", (data) => {
      console.log("Received data from server:", data);

      const text = data.details.transcriptionResults[0]?.text;
      console.log("text--> ", text);

      setMessages((prev) => [...prev, { text, sender: "server" }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === "You" ? "you" : "other"
            }`}
          >
            <span className="sender">{message.sender}</span>
            {" : "}
            <span> {message.text} </span>
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          className="chat-box"
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="chat-btn">Send</button>
      </form>
    </div>
  );
}

export default Chat;
