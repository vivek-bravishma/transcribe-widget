import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import CONFIG from '../../utils/config';
import { ConnectionState } from '../Socket/ConnectionState';
import { socket } from '../../utils/socket';
import AdaptiveCardComp from '../AdaptiveCard';

const { BASE_URL } = CONFIG;

function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [latestMessage, setLatestMessage] = useState<any>('');
    const [adaptiveCardJson, setAdaptiveCardJson] = useState({});
    const seekLastEle = useRef<HTMLDivElement>(null);

    const [isConnected, setIsConnected] = useState(socket.connected);

    const Scroll = () => {
        seekLastEle.current?.scrollIntoView();
    };

    useEffect(() => {
        Scroll();
    }, [messages]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onMessage(data) {
            console.log('Received data from server:', data);

            if (data.adaptive_card_json) {
                setAdaptiveCardJson(data.adaptive_card_json);
            }

            setMessages((prev) => [...prev, data]);
            setLatestMessage(data);
        }

        function onReset() {
            console.log('Reset Event');

            setAdaptiveCardJson({});
            setMessages([]);
            setLatestMessage('');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('data', onMessage);
        socket.on('reset', onReset);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('data', onMessage);
            socket.off('reset', onReset);
        };
    }, []);

    return (
        <div className='main-widget-container'>
            <div className='chat-container'>
                <Header data={latestMessage} isConnected={isConnected} />
                <div className='chat-messages'>
                    {messages.map((data, index) => {
                        if (!data.original_text) return;
                        return <Message data={data} key={index} />;
                    })}
                    <div className='last-msg' ref={seekLastEle}></div>
                </div>
            </div>
            {/* <AdaptiveCardComp card={adaptiveCardJson} /> */}
            {/* <AdaptiveCard card={card} /> */}
        </div>
    );
}

function Message({ data }) {
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

function Header({ data, isConnected }) {
    // console.log('header--> ', data);
    const {
        authentication_done,
        overallsentiment,
        greeting_done,
        recording_alert_done,
        thankyou_done,
    } = data;
    // console.log(
    // 	overallsentiment,
    // 	greeting_done,
    // 	recording_alert_done,
    // 	thankyou_done
    // );
    return (
        <div className='chat-header'>
            <div className='overall-sentiment-container'>
                <div className=' tw-tooltip'>
                    {authentication_done ? (
                        <>
                            <img
                                className='authentication-icon'
                                src={`${BASE_URL}/assets/images/authenticated.png`}
                                alt='auth icon'
                            />
                            <span className='tw-tooltip-text'>Authenticated</span>
                        </>
                    ) : (
                        <>
                            <img
                                className='authentication-icon'
                                src={`${BASE_URL}/assets/images/unauthenticated.png`}
                                alt='auth icon'
                            />
                            <span className='tw-tooltip-text'>Unauthenticated</span>
                        </>
                    )}
                </div>
                <ConnectionState isConnected={isConnected} />
                {overallsentiment && (
                    <div className='overall-sentiment-icon tw-tooltip'>
                        {String.fromCodePoint(overallsentiment)}
                        <span className='tw-tooltip-text'>Overall Sentiment</span>
                    </div>
                )}
            </div>
            <div className='logo-conainter'>
                <img src={`${BASE_URL}/assets/images/soundwave.gif`} alt='SoundWave gif' />
            </div>
            <div className='checkbox-container'>
                <div className='checkbox-inner-contnr'>
                    <div className='cb-ctr tw-tooltip'>
                        <div className='cb-icon'>
                            {greeting_done
                                ? String.fromCodePoint(9989)
                                : String.fromCodePoint(10060)}
                        </div>
                        <label className='header-cb-text'>Greeting Done</label>
                        <span className='tw-tooltip-text'>Greeting Done</span>
                    </div>
                    <div className='cb-ctr tw-tooltip'>
                        <div className='cb-icon'>
                            {recording_alert_done
                                ? String.fromCodePoint(9989)
                                : String.fromCodePoint(10060)}
                        </div>
                        <label className='header-cb-text'>Recording Alert</label>
                        <span className='tw-tooltip-text'>Recording Alert Done</span>
                    </div>
                    <div className='cb-ctr tw-tooltip'>
                        <div className='cb-icon'>
                            {thankyou_done
                                ? String.fromCodePoint(9989)
                                : String.fromCodePoint(10060)}
                        </div>
                        <label className='header-cb-text'>Thank You</label>
                        <span className='tw-tooltip-text'>Thank You Done</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
