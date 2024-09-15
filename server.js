<<<<<<< Updated upstream
=======
// Description: This file contains the server-side code for the Node.js server.
>>>>>>> Stashed changes
require('dotenv').config();
const express = require('express');
<<<<<<< Updated upstream
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
=======
const { Pool } = require('pg');
const { createClerkClient } = require('@clerk/clerk-sdk-node');
const detectPort = require('detect-port');
const cors = require('cors');
>>>>>>> Stashed changes

const prisma = new PrismaClient();
const app = express();
<<<<<<< Updated upstream
app.use(bodyParser.json());

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
=======

// Apply CORS middleware to allow cross-origin requests
app.use(cors());

// Default port or from the environment variable
const defaultPort = process.env.PORT || 3000;

// Detect available port and start server
detectPort(defaultPort, (err, availablePort) => {
  if (err) {
    console.error('Error detecting port:', err);
    return;
  }

  if (defaultPort === availablePort) {
    console.log(`Port ${defaultPort} is free.`);
  } else {
    console.warn(`Port ${defaultPort} is occupied. Switching to port ${availablePort}`);
  }

  // Start the server on an available port
  app.listen(availablePort, () => {
    console.log(`Server running on port ${availablePort}`);
  });
});

// Create a Clerk client instance
const Clerk = createClerkClient({ apiKey: process.env.CLERK_SECRET_KEY });

// Set up PostgreSQL connection without SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for local development
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to get user data from Clerk and link with PostgreSQL
app.get('/api/user/:id', async (req, res) => {
    try {
        const clerkUserId = req.params.id;

        // Log the received Clerk user ID for debugging
        console.log(`Fetching data for Clerk user ID: ${clerkUserId}`);

        // Fetch user data from Clerk using Clerk's API
        const clerkUser = await Clerk.users.getUser(clerkUserId);
        
        // Log Clerk user data for debugging
        console.log('Clerk user data:', clerkUser);

        // Query PostgreSQL for additional user data linked by Clerk user ID
        const result = await pool.query('SELECT * FROM users WHERE clerk_user_id = $1', [clerkUserId]);

        // Log database query result for debugging
        console.log('PostgreSQL data:', result.rows);

        // Respond with combined data from Clerk and PostgreSQL
        res.json({
            clerkUser,
            additionalData: result.rows,
>>>>>>> Stashed changes
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});
<<<<<<< Updated upstream

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

// Get user endpoint
app.get('/user', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
=======
>>>>>>> Stashed changes
