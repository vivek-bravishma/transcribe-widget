import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./style.css";

// const dumData = [
// 	{
// 		intent: "test",
// 		topics: "",
// 		sentiment: "",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text: "",
// 		original_text:
// 			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quos repellat molestiae quia vitae, fugiat eligendi nemo porro itaque obcaecati neque et sequi autem animi odio quo hic illo numquam ipsa explicabo, praesentium impedit? Nesciunt, quidem odit laborum possimus eveniet ipsum quo consectetur non hic quod ullam nihil, ex culpa!",
// 		confidence: 1,
// 		utcTimestamp: "12:15",
// 		speaker: "Customer",
// 		bodyRaw: "{{ci.text}}",
// 	},
// 	{
// 		intent: "test",
// 		topics: "",
// 		sentiment: "",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text: "",
// 		original_text:
// 			"{{context.subscriptiontext.details.transcriptionResults[0].text}}",
// 		confidence: 0.5,
// 		utcTimestamp: "12:15",
// 		speaker: "Agent",
// 		bodyRaw: "{{ci.text}}",
// 	},
// 	{
// 		intent: "test",
// 		topics: "",
// 		sentiment: "",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text: "",
// 		original_text:
// 			"{{context.subscriptiontext.details.transcriptionResults[0].text}}",
// 		confidence: 0.2,
// 		utcTimestamp: "12:15",
// 		speaker: "{{cc.speaker}}",
// 		bodyRaw: "{{ci.text}}",
// 	},
// ];

function Chat() {
	const [messages, setMessages] = useState<any>([]);
	const [newMessage, setNewMessage] = useState("");
	const seekLastEle = useRef<HTMLDivElement>(null);

	// --- dev ---

	// const [messages, setMessages] = useState<any>(dumData);
	// useEffect(() => {
	// 	messages.forEach((data) => {
	// 		setMessages((prev) => [...prev, data]);
	// 	});
	// }, []);

	// XXX dev XXX

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (newMessage.trim() === "") return;

		const updatedMessages = [
			...messages,
			{ text: newMessage, sender: "You" },
		];
		setMessages(updatedMessages);

		setNewMessage("");
	};

	// // ====== scroll ======

	const Scroll = () => {
		seekLastEle.current?.scrollIntoView();
	};

	useEffect(() => {
		Scroll();
	}, [messages]);

	// // ===XXX=== scroll ===XXX===

	useEffect(() => {
		// const socket = io("https://transcribe-api.lab.bravishma.com");
		// const socket = io("http://localhost:3000");
		const socket = io("http://localhost:5154");

		socket.on("data", (data) => {
			console.log("Received data from server:", data);

			// const text = data.details.transcriptionResults[0]?.text;
			const { original_text: text, speaker: sender } = data;
			console.log("text--> ", text);

			setMessages((prev) => [...prev, data]);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="chat-container">
			<div className="chat-messages">
				{messages.map((data, index) => {
					if (!data.original_text) return;
					return <Message data={data} key={index} />;
				})}
				<div className="last-msg" ref={seekLastEle}></div>
			</div>
			{/* <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          className="chat-box"
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="chat-btn">Send</button>
      </form>  */}
		</div>
	);
}

function Message({ data }) {
	// console.log("======================== ", data);
	const {
		intent,
		topics,
		sentiment,
		transcription_quality,
		original_language,
		translated_text,
		original_text,
		confidence,
		utcTimestamp,
		speaker,
		bodyRaw,
	} = data;
	return (
		<div className="chat-message-container">
			<div className={`chat-message`}>
				<span className="chat-sender">{speaker}</span>
				<span
					className="chat-text"
					style={{
						color: `rgba(0, 0, 0, ${
							confidence > 0 ? confidence : 0.1
						})`,
					}}>
					{" "}
					{original_text}{" "}
				</span>
				<span className="chat-time"> {utcTimestamp} </span>
			</div>
			<div className="chat-sentiment-icon">😥</div>
		</div>
	);
}

export default Chat;
