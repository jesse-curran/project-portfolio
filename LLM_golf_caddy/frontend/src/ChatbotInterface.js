import React, { useState } from 'react';
import axios from 'axios';

const ChatbotInterface = () => {
    const [userId, setUserId] = useState('');
    const [userInput, setUserInput] = useState('');
    const [chatbotResponse, setChatbotResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
                user_id: userId,
                input: userInput
            });
            setChatbotResponse(response.data.response);
        } catch (error) {
            console.error("There was an error interacting with the chatbot!", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User ID:</label>
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                </div>
                <div>
                    <label>User Input:</label>
                    <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} required />
                </div>
                <button type="submit">Get Recommendation</button>
            </form>
            {chatbotResponse && (
                <div>
                    <h3>Chatbot Recommendation:</h3>
                    <p>{chatbotResponse}</p>
                </div>
            )}
        </div>
    );
};

export default ChatbotInterface;
