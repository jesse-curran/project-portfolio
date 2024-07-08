import React from 'react';
import { Link } from 'react-router-dom';
import PreRoundInfoForm from './PreRoundInfoForm';

function Home() {
    return (
        <div>
            <h1>Welcome to the Golf Caddy App</h1>
            <PreRoundInfoForm />
            <nav>
                <Link to="/chat">Go to Chatbot</Link>
            </nav>
        </div>
    );
}

export default Home;
