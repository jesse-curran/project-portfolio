import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import ChatbotInterface from './ChatbotInterface';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<ChatbotInterface />} />
            </Routes>
        </Router>
    );
}

export default App;
