"use client";

import { useState } from 'react';

const PaymentPage = () => {
    const [total, setTotal] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        creditCardNumber: '',
        securityCode: '',
        expirationMonth: '',
        expirationYear: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        email: '',
        phoneNumber: '',
        comments: '',
    });

    const products = [
        { name: "New Product 1", price: 25.00 },
        { name: "New Product 2", price: 50.00 },
        { name: "New Product 3", price: 75.00 },
        { name: "New Product 4", price: 99.00 },
    ];

    const handleProductSelect = (product, isChecked) => {
        let updatedProducts;
        if (isChecked) {
            updatedProducts = [...selectedProducts, product];
        } else {
            updatedProducts = selectedProducts.filter(p => p.name !== product.name);
        }
        setSelectedProducts(updatedProducts);

        const updatedTotal = updatedProducts.reduce((acc, product) => acc + product.price, 0);
        setTotal(updatedTotal.toFixed(2));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle payment processing here
        alert('Payment submitted successfully!');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Payment Form</h1>
            <p>Would you like to buy anything?</p>

            {/* Product Selection */}
            <div style={styles.section}>
                <h3>Products</h3>
                {products.map((product, index) => (
                    <div key={index} style={styles.productRow}>
                        <input
                            type="checkbox"
                            id={product.name}
                            onChange={(e) => handleProductSelect(product, e.target.checked)}
                        />
                        <label htmlFor={product.name} style={styles.productLabel}>{product.name}</label>
                        <span style={styles.productPrice}>${product.price.toFixed(2)}</span>
                    </div>
                ))}
                <div style={styles.totalRow}>
                    <span>Total</span>
                    <span>${total}</span>
                </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <h3>Credit Card</h3>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        name="creditCardNumber"
                        placeholder="Credit Card Number"
                        value={formData.creditCardNumber}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="securityCode"
                        placeholder="Security Code"
                        value={formData.securityCode}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <select
                        name="expirationMonth"
                        value={formData.expirationMonth}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    >
                        <option value="">Expiration Month</option>
                        {/* Add month options here */}
                    </select>
                    <select
                        name="expirationYear"
                        value={formData.expirationYear}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    >
                        <option value="">Expiration Year</option>
                        {/* Add year options here */}
                    </select>
                </div>

                <h3>Billing Address</h3>
                <input
                    type="text"
                    name="streetAddress"
                    placeholder="Street Address"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    name="streetAddress2"
                    placeholder="Street Address Line 2"
                    value={formData.streetAddress2}
                    onChange={handleChange}
                    style={styles.input}
                />
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State / Province"
                        value={formData.state}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal / Zip Code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    >
                        <option value="">Country</option>
                        {/* Add country options here */}
                    </select>
                </div>

                <h3>Contact Information</h3>
                <div style={styles.formGroup}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                <textarea
                    name="comments"
                    placeholder="Comments"
                    value={formData.comments}
                    onChange={handleChange}
                    style={styles.textarea}
                />

                <button type="submit" style={styles.submitButton}>
                    Submit
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        fontSize: '28px',
        marginBottom: '20px',
    },
    section: {
        marginBottom: '30px',
    },
    productRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ccc',
    },
    productLabel: {
        fontSize: '16px',
    },
    productPrice: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '15px',
    },
    input: {
        flex: '1',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        resize: 'vertical',
        minHeight: '80px',
        marginBottom: '20px',
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default PaymentPage;
