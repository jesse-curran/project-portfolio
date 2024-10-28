import React, { useState, useEffect, useCallback } from 'react';

const GolferProfile = () => {
  const [clubs, setClubs] = useState([
    { id: 1, name: '', distance: '' }
  ]);
  const [handicap, setHandicap] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClubs(data.clubs || [{ id: 1, name: '', distance: '' }]);
        setHandicap(data.handicap || '');
      }
    } catch (error) {
      setError('Failed to load profile');
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClub = () => {
    if (clubs.length < 14) {
      setClubs([...clubs, { id: clubs.length + 1, name: '', distance: '' }]);
    }
  };

  const handleRemoveClub = (id) => {
    setClubs(clubs.filter(club => club.id !== id));
  };

  const handleClubChange = (id, field, value) => {
    setClubs(clubs.map(club => 
      club.id === id ? { ...club, [field]: value } : club
    ));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clubs,
          handicap
        })
      });

      if (response.ok) {
        setMessage('Profile saved successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      setError('Failed to save profile');
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      margin: '0'
    },
    message: {
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px'
    },
    success: {
      backgroundColor: '#e6ffe6',
      border: '1px solid #00cc00'
    },
    error: {
      backgroundColor: '#ffe6e6',
      border: '1px solid #cc0000'
    },
    form: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px'
    },
    input: {
      padding: '5px',
      marginBottom: '10px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px'
    },
    th: {
      textAlign: 'left',
      padding: '8px',
      borderBottom: '1px solid #ddd'
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #ddd'
    },
    button: {
      padding: '8px 16px',
      margin: '0 4px',
      cursor: 'pointer'
    },
    buttonPrimary: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none'
    },
    buttonDanger: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Golfer Profile</h1>
      </div>

      {message && (
        <div style={{...styles.message, ...styles.success}}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{...styles.message, ...styles.error}}>
          {error}
        </div>
      )}
      
      <div style={styles.form}>
        <label style={styles.label}>
          Handicap:
          <input
            type="number"
            value={handicap}
            onChange={(e) => setHandicap(e.target.value)}
            disabled={!isEditing}
            min="0"
            max="54"
            style={styles.input}
          />
        </label>
      </div>

      <div>
        <div style={styles.header}>
          <h2>Clubs in Bag ({clubs.length}/14)</h2>
          {isEditing && (
            <button
              onClick={handleAddClub}
              disabled={clubs.length >= 14}
              style={{...styles.button, ...styles.buttonPrimary}}
            >
              Add Club
            </button>
          )}
        </div>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Club</th>
              <th style={styles.th}>Distance (yards)</th>
              {isEditing && <th style={styles.th}></th>}
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id}>
                <td style={styles.td}>
                  <input
                    type="text"
                    value={club.name}
                    onChange={(e) => handleClubChange(club.id, 'name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., 7 Iron"
                    style={styles.input}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    type="number"
                    value={club.distance}
                    onChange={(e) => handleClubChange(club.id, 'distance', e.target.value)}
                    disabled={!isEditing}
                    min="0"
                    max="400"
                    style={styles.input}
                  />
                </td>
                {isEditing && (
                  <td style={styles.td}>
                    <button
                      onClick={() => handleRemoveClub(club.id)}
                      style={{...styles.button, ...styles.buttonDanger}}
                    >
                      X
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'right' }}>
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              style={styles.button}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{...styles.button, ...styles.buttonPrimary}}
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            style={{...styles.button, ...styles.buttonPrimary}}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default GolferProfile;