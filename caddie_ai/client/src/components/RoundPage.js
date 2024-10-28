import React, { useState, useEffect } from 'react';

const RoundPage = ({ selectedCourseId }) => {
  // State for course and hole information
  const [course, setCourse] = useState(null);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  
  // State for shot input
  const [shotNumber, setShotNumber] = useState(1);
  const [shotDistance, setShotDistance] = useState('');
  const [lieType, setLieType] = useState('fairway'); // default lie type
  const [wind, setWind] = useState('none'); // default wind condition
  
  // State for AI response
  const [caddieResponse, setCaddieResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch course details on component mount
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/courses/${selectedCourseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch course details');
        
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError('Failed to load course details');
      }
    };

    fetchCourseDetails();
  }, [selectedCourseId]);

  const handlePreviousHole = () => {
    if (currentHoleIndex > 0) {
      setCurrentHoleIndex(currentHoleIndex - 1);
      setShotNumber(1);
      setCaddieResponse('');
    }
  };

  const handleNextHole = () => {
    if (currentHoleIndex < (course?.holes.length || 0) - 1) {
      setCurrentHoleIndex(currentHoleIndex + 1);
      setShotNumber(1);
      setCaddieResponse('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/caddy-advice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          holeNumber: currentHoleIndex + 1,
          shotNumber,
          distance: shotDistance,
          lieType,
          wind,
          par: course?.holes[currentHoleIndex]?.par,
          handicap: course?.holes[currentHoleIndex]?.handicap
        })
      });

      if (!response.ok) throw new Error('Failed to get caddie advice');

      const data = await response.json();
      setCaddieResponse(data.advice);
      setShotNumber(shotNumber + 1);
    } catch (error) {
      setError('Failed to get caddie advice');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '20px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    formGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    label: {
      minWidth: '120px',
      fontWeight: 'bold',
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      flex: 1,
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      flex: 1,
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    disabledButton: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
    response: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      fontSize: '18px',
    },
    error: {
      color: 'red',
      marginBottom: '10px',
    }
  };

  if (!course) return <div style={styles.container}>Loading course...</div>;

  const currentHole = course.holes[currentHoleIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>{course.name}</h1>
        <h2>Hole {currentHoleIndex + 1} - Par {currentHole.par}</h2>
      </div>

      <div style={styles.navigation}>
        <button 
          onClick={handlePreviousHole} 
          style={{
            ...styles.button,
            ...(currentHoleIndex === 0 ? styles.disabledButton : {})
          }}
          disabled={currentHoleIndex === 0}
        >
          Previous Hole
        </button>
        <button 
          onClick={handleNextHole}
          style={{
            ...styles.button,
            ...(currentHoleIndex === course.holes.length - 1 ? styles.disabledButton : {})
          }}
          disabled={currentHoleIndex === course.holes.length - 1}
        >
          Next Hole
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Shot Number:</label>
          <input
            type="number"
            value={shotNumber}
            readOnly
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Shot Distance:</label>
          <input
            type="number"
            value={shotDistance}
            onChange={(e) => setShotDistance(e.target.value)}
            required
            placeholder="Distance in yards"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Lie Type:</label>
          <select 
            value={lieType}
            onChange={(e) => setLieType(e.target.value)}
            style={styles.select}
          >
            <option value="tee">Tee</option>
            <option value="fairway">Fairway</option>
            <option value="rough">Rough</option>
            <option value="sand">Sand</option>
            <option value="green">Green</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Wind:</label>
          <select 
            value={wind}
            onChange={(e) => setWind(e.target.value)}
            style={styles.select}
          >
            <option value="none">No Wind</option>
            <option value="light">Light Wind</option>
            <option value="moderate">Moderate Wind</option>
            <option value="strong">Strong Wind</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Getting Advice...' : 'Get Caddie Advice'}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}
      
      {caddieResponse && (
        <div style={styles.response}>
          <h3>Caddie Advice:</h3>
          <p>{caddieResponse}</p>
        </div>
      )}
    </div>
  );
};

export default RoundPage;