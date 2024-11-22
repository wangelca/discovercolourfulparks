"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentPage = () => {
    const router = useRouter();
    const { query } = router; // Get the query object
    const { spotId, paymentAmount, bookingDate, adults, kids } = query || {}; // Destructure safely

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle payment submission logic here
    };

    // Optional: You can add a loading state while waiting for the query parameters
    if (!spotId || !paymentAmount || !bookingDate || !adults || !kids) {
        return <p>Loading payment details...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Payment Details</h1>
            <form onSubmit={handleSubmit} className="bg-gray-200 bg-opacity-60 p-6 rounded-lg">
                <div className="mb-4">
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="ml-2 border rounded p-1"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="ml-2 border rounded p-1"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label>
                        Phone Number:
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="ml-2 border rounded p-1"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label>
                        Email Address:
                        <input
                            type="email"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleChange}
                            className="ml-2 border rounded p-1"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <p>
                        <strong>Spot ID:</strong> {spotId}
                    </p>
                    <p>
                        <strong>Payment Amount:</strong> ${paymentAmount}
                    </p>
                    <p>
                        <strong>Booking Date:</strong> {bookingDate}
                    </p>
                    <p>
                        <strong>Adults:</strong> {adults}
                    </p>
                    <p>
                        <strong>Kids:</strong> {kids}
                    </p>
                </div>
                <button type="submit" className="bg-amber-500 text-white rounded p-2">
                    Submit Payment
                </button>
            </form>
        </div>
    );
};

export default PaymentPage;