import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RoundTracking({ setLoading, setError }) {
    const [course, setCourse] = useState(null);
    const [scores, setScores] = useState([]);
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
            // Here you would typically send the scores to your backend
            console.log('Submitting scores:', scores);
            // Simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/courses');
        } catch (error) {
            setError('Failed to submit scores: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!course) {
        return null; // or a loading placeholder
    }

    return (
        <div>
            <h2>Round at {course.name}</h2>
            <form onSubmit={handleSubmit}>
                {course.holes.map((hole, index) => (
                    <div key={index}>
                        <label>
                            Hole {hole.number} (Par {hole.par}):
                            <input
                                type="number"
                                min="1"
                                value={scores[index]}
                                onChange={(e) => handleScoreChange(index, e.target.value)}
                            />
                        </label>
                    </div>
                ))}
                <div>Total Score: {calculateTotalScore()}</div>
                <button type="submit">Finish Round</button>
            </form>
            <button onClick={() => navigate('/courses')}>Cancel Round</button>
        </div>
    );
}

export default RoundTracking;