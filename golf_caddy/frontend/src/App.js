import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Golf Caddy App</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
