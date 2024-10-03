import React, { useState } from 'react';

function CaddyAdvice({ holeNumber, distance }) {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/caddy-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holeNumber, distance, weather: 'sunny' }) // Add more parameters as needed
      });
      const data = await response.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error('Error getting caddy advice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getAdvice} disabled={loading}>Get Caddy Advice</button>
      {loading ? <p>Loading advice...</p> : <p>{advice}</p>}
    </div>
  );
}

export default CaddyAdvice;