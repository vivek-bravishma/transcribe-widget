import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './style.css';
import CONFIG from '../../utils/config';
import soundwaveImg from '../../assets/images/soundwave.gif';

const { BASE_URL, SOCKET_URL } = CONFIG;

const AGENT = 'Agent';
const CUSTOMER = 'Customer';

// const dumData = [
// 	{
// 		intent: "test",
// 		topics: "banking",
// 		sentiment: "128545",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text:
// 			"The company itself is a very successful company. And those who are repulsed by the trouble of life, let no one be blinded by the hatred of the soul, which I shall never explain here.",
// 		original_text:
// 			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quos repellat molestiae quia vitae, fugiat eligendi nemo porro itaque obcaecati neque et sequi autem animi odio quo hic illo numquam ipsa explicabo.",
// 		confidence: 1,
// 		utcTimestamp: "12:15",
// 		speaker: CUSTOMER,
// 		bodyRaw: "{{ci.text}}",
// 		overallsentiment: "",
// 		greeting_done: true,
// 		recording_alert_done: true,
// 		thankyou_done: false,
// 	},
// 	{
// 		intent: "test",
// 		topics: "banking",
// 		sentiment: "128545",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text:
// 			"The company itself is a very successful company. And those who are repulsed by the trouble of life, let no one be blinded by the hatred of the soul, which I shall never explain here.",
// 		original_text:
// 			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quos repellat molestiae quia vitae, fugiat eligendi nemo porro itaque obcaecati neque et sequi autem animi odio quo hic illo numquam ipsa explicabo.",
// 		confidence: 1,
// 		utcTimestamp: "12:15",
// 		speaker: AGENT,
// 		bodyRaw: "{{ci.text}}",
// 		overallsentiment: "",
// 		greeting_done: true,
// 		recording_alert_done: true,
// 		thankyou_done: false,
// 	},
// 	{
// 		intent: "test",
// 		topics: "banking",
// 		sentiment: "",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text: "what do you say??",
// 		original_text: "Tu ergo quid dicis??",
// 		confidence: 0.5,
// 		utcTimestamp: "12:15",
// 		speaker: AGENT,
// 		bodyRaw: "{{ci.text}}",
// 		overallsentiment: "",
// 		greeting_done: true,
// 		recording_alert_done: true,
// 		thankyou_done: false,
// 	},
// 	{
// 		intent: "test",
// 		topics: "banking",
// 		sentiment: "129320",
// 		transcription_quality: "",
// 		original_language: "",
// 		translated_text: "",
// 		original_text:
// 			"{{context.subscriptiontext.details.transcriptionResults[0].text}}",
// 		confidence: 0.2,
// 		utcTimestamp: "12:15",
// 		speaker: "{{cc.speaker}}",
// 		bodyRaw: "{{ci.text}}",
// 		overallsentiment: "128545",
// 		greeting_done: true,
// 		recording_alert_done: true,
// 		thankyou_done: false,
// 	},
// ];

function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');
    const [latestMessage, setLatestMessage] = useState<any>('');
    const seekLastEle = useRef<HTMLDivElement>(null);

    // --- dev ---

    // const [messages, setMessages] = useState<any>(dumData);
    // const [latestMessage, setLatestMessage] = useState<any>(dumData);
    // useEffect(() => {
    // 	messages.forEach((data, index) => {
    // 		console.log("hi=> ", index);
    // 		setLatestMessage(data);
    // 		setMessages((prev) => [...prev, data]);
    // 	});

    // 	return () => {
    // 		messages.forEach((data, index) => {
    // 			console.log("hello=> ", index);
    // 			setLatestMessage("");
    // 			setMessages("");
    // 		});
    // 	};
    // }, []);

    // XXX dev XXX

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const updatedMessages = [...messages, { text: newMessage, sender: 'You' }];
        setMessages(updatedMessages);

        setNewMessage('');
    };

    const Scroll = () => {
        seekLastEle.current?.scrollIntoView();
    };

    useEffect(() => {
        Scroll();
    }, [messages]);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('disconnect', (res) => {
            console.log('disconnect', res);
        });

        socket.on('data', (data) => {
            console.log('Received data from server:', data);

            // const text = data.details.transcriptionResults[0]?.text;
            const { original_text: text, speaker: sender } = data;
            console.log('text--> ', text);

            setMessages((prev) => [...prev, data]);
            setLatestMessage(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='chat-container'>
            <Header data={latestMessage} />
            <div className='chat-messages'>
                {messages.map((data, index) => {
                    if (!data.original_text) return;
                    return <Message data={data} key={index} />;
                })}
                <div className='last-msg' ref={seekLastEle}></div>
            </div>
            {/* 
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
			 */}
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
        <div className={`chat-message-container ${speaker.toLocaleLowerCase()}`}>
            <div className='message-title'>
                <span className='message-sender'>{speaker}</span>
                <span className='message-time'>[{utcTimestamp}]</span>
            </div>
            <div className='message-content-row'>
                <div className={`chat-message`}>
                    <span
                        className='chat-text'
                        style={{
                            color: `rgba(0, 0, 0, ${confidence > 0.4 ? confidence : 0.4})`,
                        }}
                    >
                        <span className='original-text'>{original_text}</span>
                        <span className='translated-text'>
                            {translated_text && `[${translated_text}]`}
                        </span>
                    </span>
                </div>
                <div className='chat-sentiment-icon'>
                    {sentiment && `${String.fromCodePoint(sentiment)}`}
                </div>
            </div>

            {speaker.toLocaleLowerCase() !== 'agent' && (
                <div className='message-meta'>
                    <span className='message-topic'>Topics : {topics}</span>
                    <span className='message-intent'>Intent : {intent}</span>
                </div>
            )}
        </div>
    );
}

function Header({ data }) {
    // console.log("header--> ", data);
    const { overallsentiment, greeting_done, recording_alert_done, thankyou_done } = data;
    // console.log(
    // 	overallsentiment,
    // 	greeting_done,
    // 	recording_alert_done,
    // 	thankyou_done
    // );
    return (
        <div className='chat-header'>
            <div className='logo-conainter'>
                <img src={`${BASE_URL}/assets/images/soundwave.gif`} alt='SoundWave gif' />
            </div>
            <div className='overall-sentiment-container'>
                {overallsentiment && String.fromCodePoint(overallsentiment)}
            </div>
            <div className='checkbox-container'>
                <div className='checkbox-inner-contnr'>
                    <div className=''>
                        {/* <input
						className="header-checkbox"
						disabled={true}
						checked={greeting_done}
						type="checkbox"
					/> */}
                        <div className='cb-icon'>
                            {greeting_done
                                ? String.fromCodePoint(9989)
                                : String.fromCodePoint(10060)}
                        </div>
                        <label className='header-cb-text'>Greeting</label>
                    </div>
                    <div className=''>
                        {/* <input
						className="header-checkbox"
						type="checkbox"
						disabled={true}
						checked={recording_alert_done}
					/> */}
                        <div className='cb-icon'>
                            {recording_alert_done
                                ? String.fromCodePoint(9989)
                                : String.fromCodePoint(10060)}
                        </div>

                        <label className='header-cb-text'>Recording Alert</label>
                    </div>
                    <div className=''>
                        {/* <input
						className="header-checkbox"
						type="checkbox"
						disabled={true}
						checked={thankyou_done}
					/> */}
                        <div className='cb-icon'>
                            {thankyou_done
                                ? String.fromCodePoint(9989)
                                : String.fromCodePoint(10060)}
                        </div>

                        <label className='header-cb-text'>Thank You</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;

// return (
//   <div className={`chat-message-container ${speaker} `}>
//     {/* <div className="message-row"> */}
//       <div className={`chat-message`}>
//         <div className="chat-message-title">
//           <span className="chat-sender">{speaker}</span>
//           <span className="chat-time">[{utcTimestamp}]</span>
//         </div>
//         <span
//           className="chat-text"
//           style={{
//             color: `rgba(0, 0, 0, ${
//               confidence > 0 ? confidence : 0.1
//             })`,
//           }}>
//           <span className="original-text">{original_text}</span>
//           <span className="translated-text">
//             {translated_text}
//           </span>
//         </span>
//         {/* <span className="chat-time"> {utcTimestamp} </span> */}
//       </div>
//     {/* </div> */}
//     <div className="chat-sentiment-icon">
//       {String.fromCodePoint(sentiment)}
//     </div>
//   </div>
// );
