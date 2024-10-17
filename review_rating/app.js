import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const EventPage = ({ eventId }) => {
    return (
        <div>
            <h1>Event Details</h1>
            <ReviewForm eventId={eventId}/>
            <ReviewList eventId={eventId}/>
        </div>
    );
};

export default EventPage;