import React from 'react';
import { Link } from 'react-router-dom';

const EventList = ({ events }) => {
    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <h2>{event.name}</h2>
                        {/* Link to the detailed event page */}
                        <Link to={`/events/${event.id}`}>View Details and Reviews</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
