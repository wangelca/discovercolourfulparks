"use client"; // Mark this component as a Client Component

import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
    return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
    const [bookingDetails, setBookingDetails] = useState(null);

    return (
        <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
            {children}
        </BookingContext.Provider>
    );
};
