import React from 'react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <HomePage />
      </div>
    </AuthProvider>
  );
}

export default App;