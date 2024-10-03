import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseList({ setLoading, setError }) {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleCourseSelect = useCallback((courseId) => {
        navigate(`/round/${courseId}`);
    }, [navigate]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/');
    }, [navigate]);

    return (
        <div>
            <h2>Golf Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <h3>{course.name}</h3>
                        <p>Location: {course.location}</p>
                        <p>Number of holes: {course.holes.length}</p>
                        <button onClick={() => handleCourseSelect(course.id)}>Start Round</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default CourseList;