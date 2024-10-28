import React, { useState, useEffect } from 'react';

const RoundPage = ({ selectedCourseId, onExit }) => {
  // State for course and hole information
  const [course, setCourse] = useState(null);
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  
  // Enhanced shot input state
  const [shotNumber, setShotNumber] = useState(1);
  const [shotDistance, setShotDistance] = useState('');
  const [lieType, setLieType] = useState('fairway');
  const [lieAngle, setLieAngle] = useState('flat');
  const [windSpeed, setWindSpeed] = useState('0');
  const [windDirection, setWindDirection] = useState('none');
  
  // State for AI response
  const [caddieResponse, setCaddieResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile and course details on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!profileResponse.ok) throw new Error('Failed to fetch user profile');
        const profileData = await profileResponse.json();
        setUserProfile(profileData);

        // Fetch course details
        const courseResponse = await fetch(`http://localhost:3000/api/courses/${selectedCourseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!courseResponse.ok) throw new Error('Failed to fetch course details');
        const courseData = await courseResponse.json();
        setCourse(courseData);
      } catch (error) {
        setError('Failed to load initial data: ' + error.message);
      }
    };

    fetchInitialData();
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

  const getRecommendedClub = (distance) => {
    if (!userProfile?.clubs || userProfile.clubs.length === 0) return null;
    
    // Sort clubs by distance
    const sortedClubs = [...userProfile.clubs].sort((a, b) => b.distance - a.distance);
    
    // Find the first club that can reach the distance
    return sortedClubs.find(club => club.distance >= distance) || sortedClubs[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const currentHole = course.holes[currentHoleIndex];
      const recommendedClub = getRecommendedClub(parseInt(shotDistance));

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
          lieAngle,
          windSpeed,
          windDirection,
          par: currentHole.par,
          handicap: userProfile.handicap,
          holeDistance: currentHole.distance,
          holeDescription: currentHole.description,
          recommendedClub: recommendedClub ? recommendedClub.name : null,
          userClubs: userProfile.clubs
        })
      });

      if (!response.ok) throw new Error('Failed to get caddie advice');

      const data = await response.json();
      setCaddieResponse(data.advice);
    } catch (error) {
      setError('Failed to get caddie advice: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    // ... (keeping existing styles) ...
    holeInfo: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '20px',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginBottom: '15px',
    }
  };

  if (!course || !userProfile) return <div style={styles.container}>Loading...</div>;

  const currentHole = course.holes[currentHoleIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>{course.name}</h1>
        <div style={styles.holeInfo}>
          <h2>Hole {currentHoleIndex + 1} - Par {currentHole.par}</h2>
          <p>Distance: {currentHole.distance} yards</p>
          <p>Description: {currentHole.description || 'No description available'}</p>
          <p>Your Handicap: {userProfile.handicap}</p>
        </div>
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
        <div style={styles.gridContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Shot Number:</label>
            <input
              type="number"
              value={shotNumber}
              onChange={(e) => setShotNumber(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
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
            <label style={styles.label}>Lie Angle:</label>
            <select 
              value={lieAngle}
              onChange={(e) => setLieAngle(e.target.value)}
              style={styles.select}
            >
              <option value="flat">Flat</option>
              <option value="uphill">Uphill</option>
              <option value="downhill">Downhill</option>
              <option value="left-to-right">Left to Right</option>
              <option value="right-to-left">Right to Left</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Wind Speed:</label>
            <select 
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                style={styles.select}
            >
                <option value="none">None</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Wind Direction:</label>
            <select 
              value={windDirection}
              onChange={(e) => setWindDirection(e.target.value)}
              style={styles.select}
            >
              <option value="none">No Wind</option>
              <option value="headwind">Headwind</option>
              <option value="tailwind">Tailwind</option>
              <option value="left-to-right">Left to Right</option>
              <option value="right-to-left">Right to Left</option>
            </select>
          </div>
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

      <button 
        onClick={onExit} 
        style={{...styles.button, backgroundColor: '#666', marginTop: '20px'}}
      >
        Exit Round
      </button>
    </div>
  );
};

export default RoundPage;