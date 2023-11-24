import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';

const Chat = ({ currentUserId, otherUserId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesContainerRef = useRef(null);

    const data = {
        sender: currentUserId,
        receiver: otherUserId,
        content: message
    };

    const getMessages = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/message/${currentUserId}/${otherUserId}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });
        setMessages(res.data);
    };

    const sendMessage = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.post(`http://localhost:5000/api/message`, data, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });
        setMessage('');
        getMessages(); // Update the message list after sending a message.
    };

    useEffect(() => {
        getMessages();
    }, []);

    // Function to scroll to the bottom of the message container
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div style={{ padding: '10px', position: 'relative', height: '60vh' }}>
            <div style={{ position: 'relative' }}>
                <ul
                    ref={messagesContainerRef}
                    style={{ overflow: 'auto', height: '500px' }}
                >
                    {messages.map((msg, index) => (
                        <li
                            key={index}
                            style={{ textAlign: msg.sender._id === currentUserId ? 'right' : 'left' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>
                                    <img src={msg.sender.avatar.secure_url} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                </span>
                                <span style={{ backgroundColor: msg.sender._id === currentUserId ? 'white' : '#DDDDDD', padding: '3px', borderRadius: '10px' }}>
                                    {msg.content}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ position: 'absolute', bottom: '0' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
