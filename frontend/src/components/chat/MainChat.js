
import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MainChat = () => {
    const { id } = useParams()
    const [otherUser, setOtherUser] = useState('');
    const currUserId = useSelector(state => state?.auth?.user?._id)
    const currentUserId = currUserId;
    const otherUserId = id;

    const getUser = async (id) => {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`)
        setOtherUser(res.data.user.name)
    }
    useEffect(() => {
        getUser(otherUserId)
    }, [])

    return (
        <div className='container-chat' style={{ marginTop: "90px", height: '70vh', margin: '200px' }}>
            <h1>Chat with {otherUser}</h1>
            <Chat currentUserId={currentUserId} otherUserId={otherUserId} />
        </div>
    );
};

export default MainChat;    
