import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
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
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleCourseSelect = (courseId) => {
        // Navigate to the round tracking page with the selected course ID
        navigate(`/round/${courseId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return <div>Loading courses...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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