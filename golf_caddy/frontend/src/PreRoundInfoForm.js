import React, { useState } from 'react';
import axios from 'axios';

const PreRoundInfoForm = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        player_name: '',
        handicap: '',
        club_distances: {
            driver: '',
            iron_7: ''
        },
        characteristics: ''
    });

    const [retrievedData, setRetrievedData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleClubDistanceChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            club_distances: {
                ...prevState.club_distances,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/save_pre_round_info`, formData);
            alert(response.data.message);
        } catch (error) {
            console.error("There was an error saving the pre-round info!", error);
        }
    };

    const handleRetrieve = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get_pre_round_info/${formData.user_id}`);
            setRetrievedData(response.data);
        } catch (error) {
            console.error("There was an error retrieving the pre-round info!", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User ID:</label>
                    <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />
                </div>
                <div>
                    <label>Player Name:</label>
                    <input type="text" name="player_name" value={formData.player_name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Handicap:</label>
                    <input type="number" name="handicap" value={formData.handicap} onChange={handleChange} required />
                </div>
                <div>
                    <label>Driver Distance:</label>
                    <input type="number" name="driver" value={formData.club_distances.driver} onChange={handleClubDistanceChange} required />
                </div>
                <div>
                    <label>7 Iron Distance:</label>
                    <input type="number" name="iron_7" value={formData.club_distances.iron_7} onChange={handleClubDistanceChange} required />
                </div>
                <div>
                    <label>Characteristics:</label>
                    <input type="text" name="characteristics" value={formData.characteristics} onChange={handleChange} required />
                </div>
                <button type="submit">Save Info</button>
            </form>
            <div>
                <button onClick={handleRetrieve}>Retrieve Info</button>
                {retrievedData && (
                    <div>
                        <h3>Retrieved Pre-round Info:</h3>
                        <p>User ID: {retrievedData.user_id}</p>
                        <p>Player Name: {retrievedData.player_name}</p>
                        <p>Handicap: {retrievedData.handicap}</p>
                        <p>Driver Distance: {retrievedData.club_distances?.driver}</p>
                        <p>7 Iron Distance: {retrievedData.club_distances?.iron_7}</p>
                        <p>Characteristics: {retrievedData.characteristics}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreRoundInfoForm;
