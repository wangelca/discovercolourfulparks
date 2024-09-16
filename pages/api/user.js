// pages/api/user.js
export const config = {
    runtime: 'nodejs', // Set the runtime explicitly for this route
  };
  
  import { getAuth } from '@clerk/nextjs/server';
  import { Pool } from 'pg';
  
  const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false // Ensure this is safe for production
      }
  });
  
  export default async function handler(req, res) {
      const { userId } = getAuth(req);
      console.log("API accessed with userId:", userId);
  
      const client = await pool.connect();
      try {
          console.log("Connected to database with URL:", process.env.DATABASE_URL);
          const result = await client.query('SELECT * FROM users WHERE user_id = $1', [userId]);
          console.log("Query executed, result:", result.rows);
  
          if (result.rows.length > 0) {
              res.status(200).json({ user: result.rows[0] });
          } else {
              console.log("User not found with user_id:", userId);
              res.status(404).json({ message: "User not found" });
          }
      } catch (error) {
          console.error('Failed to fetch user data:', error);
          res.status(500).json({ error: "Internal Server Error" });
      } finally {
          client.release();
      }
  }
  