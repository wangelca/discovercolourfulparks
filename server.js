// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const { Pool } = require('pg');
const { createClerkClient } = require('@clerk/clerk-sdk-node');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

const detectPort = require('detect-port');

const PORT = 3000;

detectPort(PORT, (err, availablePort) => {
  if (err) {
    console.error(err);
    return;
  }

  if (PORT === availablePort) {
    console.log(`Port ${PORT} is free.`);
  } else {
    console.warn(`Port ${PORT} is occupied. Switching to port ${availablePort}`);
  }

  app.listen(availablePort, () => {
    console.log(`Server running on port ${availablePort}`);
  });
});


// Create a Clerk client instance
const Clerk = createClerkClient({ apiKey: process.env.CLERK_API_KEY });

// Log the Clerk instance to see available methods and properties
console.log(Clerk);

// Set up PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to get user data from Clerk and link with PostgreSQL
app.get('/api/user/:id', async (req, res) => {
    try {
        // Fetch user data from Clerk using Clerk's user ID
        const clerkUserId = req.params.id;
        const clerkUser = await Clerk.users.getUser(clerkUserId);

        // Query PostgreSQL for additional user data based on Clerk user ID
        const result = await pool.query('SELECT * FROM users WHERE clerk_user_id = $1', [clerkUserId]);

        // Respond with combined user data
        res.json({
            clerkUser,
            additionalData: result.rows,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
