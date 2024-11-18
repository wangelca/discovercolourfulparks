//references: ChatGPT: how to display the wildlife sightings to the front end
import React, { useEffect, useState } from 'react';
import Map from './wildlife_feature/Map'; 
import axios from 'axios';

const WildlifeSightings = () => {
    const [sightings, setSightings] = useState([]);

    useEffect(() => {
        axios.get('/api/wildlife/recent')
            .then(response => setSightings(response.data))
            .catch(error => console.error("Error fetching sightings", error));
    }, []);

    return (
        <div>
            <h2>Recent Wildlife Sightings</h2>
            <Map sightings={sightings} />
            {/* Form to report a new sighting */}
        </div>
    );
};

export default WildlifeSightings;
