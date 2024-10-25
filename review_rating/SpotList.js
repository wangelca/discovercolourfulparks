import React from 'react';
import { Link } from 'react-router-dom';

const SpotList = ({ spots }) => {
    return (
        <div>
            <h1>Spots</h1>
            <ul>
                {spots.map(spot => (
                    <li key={spot.id}>
                        <h2>{spot.name}</h2>
                        {/* Link to the detailed spot page */}
                        <Link to={`/spots/${spot.id}`}>View Details and Reviews</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SpotList;
