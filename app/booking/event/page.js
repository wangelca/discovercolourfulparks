"use client";

import { useSearchParams, useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';

const EventBookingPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const eventId = searchParams.get('eventId');
    const eventName = searchParams.get('eventName');
    const [numParticipants, setNumParticipants] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(1); // Replace with actual user ID retrieval logic

    // Simulating user ID retrieval (you can replace this with actual logic)
    useEffect(() => {
        // For example, you can retrieve the user ID from localStorage or an API call
        // setUserId(actualUserId); // Uncomment and implement this line
    }, []);

    // Handle form submission for booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!eventId || !eventName) {
            alert('Missing event information.');
            setLoading(false);
            return;
        }

        if (numParticipants < 1) {
            alert("Number of participants must be at least 1.");
            setLoading(false);
            return;
        }

        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const dateTimeStr = `${dateStr}T${preferredTime}:00`;

        const bookingStartTime = new Date(dateTimeStr);
        if (isNaN(bookingStartTime)) {
            alert("Invalid preferred time value");
            setLoading(false);
            return;
        }

        const bookingData = {
            eventId,
            id: userId, // Using the dynamically retrieved userId
            bookingStartTime: bookingStartTime.toISOString(),
            numParticipants,
            specialInstructions,
        };

        try {
            const response = await fetch('http://localhost:8000/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Failed to submit booking: ' + errorData.detail);
            }

            const data = await response.json();

            if (data.requiresPayment) {
                // Redirect to the payment page if payment is required
                router.push(`/payment?bookingId=${data.bookingId}&amount=${data.paymentAmount}`);
            } else {
                alert('Booking successful! Redirecting to events page.');
                router.push(`/events`); // Redirect back to events page after successful booking
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Booking submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // If loading, show a loading state
    if (loading) {
        return <div>Loading booking details...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Booking for {eventName}</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="numParticipants" style={styles.label}>Number of Participants:</label>
                    <input
                        type="number"
                        id="numParticipants"
                        value={numParticipants}
                        onChange={(e) => setNumParticipants(e.target.value)}
                        min="1"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="preferredTime" style={styles.label}>Preferred Time:</label>
                    <input
                        type="time"
                        id="preferredTime"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="specialInstructions" style={styles.label}>Special Instructions:</label>
                    <textarea
                        id="specialInstructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        style={styles.textarea}
                    />
                </div>
                <button type="submit" style={styles.submitButton} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Booking'}
                </button>
            </form>
        </div>
    );
};

// Define inline styles
const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        resize: 'vertical',
        minHeight: '80px',
    },
    submitButton: {
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#0070f3',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default EventBookingPage;
