import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import CourseList from './components/CourseList';
import RoundTracking from './components/RoundTracking';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {loading && <div className="loading-overlay">Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          <Routes>
            <Route path="/" element={<Login setLoading={setLoading} setError={setError} />} />
            <Route path="/courses" element={<PrivateRoute><CourseList setLoading={setLoading} setError={setError} /></PrivateRoute>} />
            <Route path="/round/:courseId" element={<PrivateRoute><RoundTracking setLoading={setLoading} setError={setError} /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

export default App;