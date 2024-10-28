import React, { useState, useEffect } from 'react';
import RoundPage from './RoundPage';

const HomePage = () => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRound, setShowRound] = useState(false);

  // Profile states
  const [clubs, setClubs] = useState([{ id: 1, name: '', distance: '' }]);
  const [handicap, setHandicap] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Course selection states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  
  // Status messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      loadProfile();
      loadCourses();
    }
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      const response = await fetch('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`, // Changed from just token
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load profile');
      }
      
      const data = await response.json();
      console.log('Loaded profile:', data);
      setClubs(data.clubs?.length > 0 ? data.clubs.map((club, index) => ({
        ...club,
        id: index + 1
      })) : [{ id: 1, name: '', distance: '' }]);
      setHandicap(data.handicap || '');
      setError('');
    } catch (error) {
      console.error('Load profile error:', error);
      setError(`Failed to load profile: ${error.message}`);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      // Filter out empty clubs
      const validClubs = clubs.filter(club => club.name && club.distance);
  
      // Prepare the data
      const profileData = {
        handicap: parseInt(handicap) || 0,
        clubs: validClubs.map(club => ({
          name: club.name,
          distance: parseInt(club.distance) || 0
        }))
      };
  
      console.log('Saving profile data:', profileData);
  
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Changed from just token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }
  
      const data = await response.json();
      console.log('Save profile response:', data);
      
      setMessage('Profile saved successfully');
      setIsEditingProfile(false);
      setError('');
      
      // Reload profile to get updated data
      loadProfile();
    } catch (error) {
      console.error('Save profile error:', error);
      setError(`Failed to save profile: ${error.message}`);
    }
  };

  const handleAddClub = () => {
    if (clubs.length < 14) {
      const newId = Math.max(...clubs.map(club => club.id), 0) + 1;
      setClubs([...clubs, { id: newId, name: '', distance: '' }]);
    }
  };

  const handleRemoveClub = (idToRemove) => {
    setClubs(clubs.filter(club => club.id !== idToRemove));
  };

  const handleClubChange = (id, field, value) => {
    setClubs(clubs.map(club => 
      club.id === id ? { ...club, [field]: value } : club
    ));
    console.log('Updated clubs:', clubs);
  };

  // Authentication handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        console.log('Token stored:', localStorage.getItem('token'));
        setMessage('Login successful!');
        loadProfile();
        loadCourses();
        // Clear login fields
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setError('Login failed: ' + data.message);
      }
    } catch (error) {
      setError('Login error: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Registration successful! Please log in.');
        // Clear registration fields
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
      } else {
        setError('Registration failed: ' + data.message);
      }
    } catch (error) {
      setError('Registration error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setSelectedCourse('');
    setClubs([{ id: 1, name: '', distance: '' }]);
    setHandicap('');
    setMessage('');
    setError('');
  };

  // Course handlers
  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      const response = await fetch('http://localhost:3000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`, // Changed from just token
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load courses');
      }
    } catch (error) {
      console.error('Load courses error:', error);
      setError('Failed to load courses: ' + error.message);
    }
  };

    const handleStartRound = () => {
    if (!selectedCourse) {
        setError('Please select a course first');
        return;
    }
    setShowRound(true);
    };

  // Styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    section: {
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
    },
    message: {
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#e6ffe6',
      border: '1px solid #00cc00',
    },
    error: {
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#ffe6e6',
      border: '1px solid #cc0000',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    input: {
      padding: '8px',
      marginBottom: '10px',
    },
    button: {
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      marginTop: '10px',
    },
    select: {
      padding: '8px',
      marginBottom: '10px',
    },
    clubsContainer: {
      marginTop: '20px',
    },
    clubEntry: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
      alignItems: 'center',
    },
    removeButton: {
      padding: '5px 10px',
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      {message && <div style={styles.message}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {!isLoggedIn ? (
        <div style={styles.section}>
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Email"
              required
              style={styles.input}
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>

          <h2>Register</h2>
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              placeholder="Username"
              required
              style={styles.input}
            />
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="Email"
              required
              style={styles.input}
            />
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Register</button>
          </form>
        </div>
      ) : showRound ? (
        <RoundPage 
          selectedCourseId={selectedCourse}
          onExit={() => setShowRound(false)}
        />
      ) : (
        <>
          <div style={styles.section}>
            <h2>Profile</h2>
            <div style={styles.form}>
              <label>
                Handicap:
                <input
                  type="number"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  disabled={!isEditingProfile}
                  style={styles.input}
                />
              </label>
              
              <div style={styles.clubsContainer}>
                <h3>Clubs in Bag ({clubs.length}/14)</h3>
                {isEditingProfile && (
                  <button 
                    onClick={handleAddClub}
                    disabled={clubs.length >= 14}
                    style={{...styles.button, marginBottom: '10px'}}
                  >
                    Add Club
                  </button>
                )}
                
                {clubs.map((club) => (
                  <div key={club.id} style={styles.clubEntry}>
                    <input
                      type="text"
                      value={club.name}
                      onChange={(e) => handleClubChange(club.id, 'name', e.target.value)}
                      placeholder="Club name"
                      disabled={!isEditingProfile}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      value={club.distance}
                      onChange={(e) => handleClubChange(club.id, 'distance', e.target.value)}
                      placeholder="Distance"
                      disabled={!isEditingProfile}
                      style={styles.input}
                    />
                    {isEditingProfile && (
                      <button 
                        onClick={() => handleRemoveClub(club.id)}
                        style={styles.removeButton}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditingProfile ? (
                <div>
                  <button 
                    onClick={handleSaveProfile}
                    style={styles.button}
                  >
                    Save Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingProfile(false);
                      loadProfile(); // Reset to saved data
                    }}
                    style={{...styles.button, backgroundColor: '#666'}}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  style={styles.button}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h2>Select Course</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <button 
              onClick={handleStartRound}
              disabled={!selectedCourse}
              style={{
                ...styles.button,
                opacity: !selectedCourse ? 0.5 : 1
              }}
            >
              Start Round
            </button>
          </div>

          <button 
            onClick={handleLogout}
            style={{...styles.button, backgroundColor: '#f44336'}}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;