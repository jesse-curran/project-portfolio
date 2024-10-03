import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RoundTracking({ setLoading, setError }) {
    const [course, setCourse] = useState(null);
    const [scores, setScores] = useState([]);
    const [caddyAdvice, setCaddyAdvice] = useState('');
    const [shotDistance, setShotDistance] = useState('');
    const [weather, setWeather] = useState('sunny');
    const { courseId } = useParams();
    const navigate = useNavigate();

    const fetchCourse = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch course');
            }
            const data = await response.json();
            setCourse(data);
            setScores(new Array(data.holes.length).fill(0));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [courseId, setLoading, setError]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleScoreChange = (index, value) => {
        const newScores = [...scores];
        newScores[index] = Number(value);
        setScores(newScores);
    };

    const calculateTotalScore = () => {
        return scores.reduce((sum, score) => sum + score, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            console.log('Submitting scores:', scores);
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/courses');
        } catch (error) {
            setError('Failed to submit scores: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getCaddyAdvice = async (holeNumber) => {
        if (!shotDistance) {
            setError('Please enter the shot distance.');
            return;
        }
        setLoading(true);
        setError(null);
        setCaddyAdvice('');
        try {
            const response = await fetch('http://localhost:3000/api/caddy-advice', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    holeNumber, 
                    distance: shotDistance, 
                    weather 
                })
            });
            if (!response.ok) {
                throw new Error('Failed to get caddy advice');
            }
            const data = await response.json();
            setCaddyAdvice(data.advice);
        } catch (error) {
            setError('Failed to get caddy advice: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!course) {
        return null;
    }

    return (
        <div>
            <h2>Round at {course.name}</h2>
            <form onSubmit={handleSubmit}>
                {course.holes.map((hole, index) => (
                    <div key={index}>
                        <h3>Hole {hole.number} (Par {hole.par})</h3>
                        <label>
                            Score:
                            <input
                                type="number"
                                min="1"
                                value={scores[index]}
                                onChange={(e) => handleScoreChange(index, e.target.value)}
                            />
                        </label>
                        <div>
                            <label>
                                Shot Distance (yards):
                                <input
                                    type="number"
                                    value={shotDistance}
                                    onChange={(e) => setShotDistance(e.target.value)}
                                    min="0"
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Weather:
                                <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                                    <option value="sunny">Sunny</option>
                                    <option value="cloudy">Cloudy</option>
                                    <option value="windy">Windy</option>
                                    <option value="rainy">Rainy</option>
                                </select>
                            </label>
                        </div>
                        <button type="button" onClick={() => getCaddyAdvice(hole.number)}>
                            Get Caddy Advice
                        </button>
                    </div>
                ))}
                <div>Total Score: {calculateTotalScore()}</div>
                <button type="submit">Finish Round</button>
            </form>
            {caddyAdvice && (
                <div>
                    <h3>Caddy Advice:</h3>
                    <p>{caddyAdvice}</p>
                </div>
            )}
            <button onClick={() => navigate('/courses')}>Cancel Round</button>
        </div>
    );
}

export default RoundTracking;