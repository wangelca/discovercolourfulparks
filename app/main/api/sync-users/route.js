// pages/api/sync-users.js

import { createClerkClient } from "@clerk/nextjs/server";
import { SessionLocal } from "/database.py"; // Adjust path to your database module
import { User } from "/models.py"; 
import axios from "axios";

export default async function handler(req, res) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const db = SessionLocal(); // Initialize SQLAlchemy session

  try {
    // Fetch all users from Clerk
    const users = await clerkClient.users.getUserList();

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(200).json({ message: "No users found in Clerk." });
    }

    console.log("Syncing users:", users);

    // Loop through Clerk users and upsert them into Supabase (via SQLAlchemy)
    for (const user of users) {
      //const email = user.emailAddresses?.[0]?.emailAddress || "";
      //const phoneNumber = user.phoneNumbers?.[0]?.phoneNumber || "";
      //const publicMetadata = user.publicMetadata || { role: "visitor" };

      // Update public metadata for new users
      if (!user.publicMetadata?.role) {
        // Make API request to update Clerk's public metadata
        const clerkUpdateResponse = await axios.patch(
          `https://api.clerk.com/v1/users/${user.id}/metadata`,
          {
            public_metadata: {
              role: "visitor",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
          }
        );
        
        // Handle potential errors in the request
        if (clerkUpdateResponse.status !== 200) {
          const errorResponse = clerkUpdateResponse.data;
          console.error("Error updating Clerk user metadata:", errorResponse);
          continue;  // Skip to the next user
        }
      }

      // Check if the user already exists in the database
      const existingUser = await db
        .query(User)
        .filter(User.clerk_user_id == user.id)
        .first();

      if (existingUser) {
        // Update existing user
        existingUser.email = email;
        existingUser.public_metadata = publicMetadata;
      } else {
        // Insert new user
        const newUser = User(
          (clerk_user_id = user.id),
          (username = user.username || ""),
          (first_name = user.firstName || ""),
          (last_name = user.lastName || ""),
          (email = email),
          (phone_number = phoneNumber),
          (public_metadata = publicMetadata)
        );
        db.add(newUser);
      }

      await db.commit(); // Commit after every user sync to avoid conflicts
    }

    res.status(200).json({ message: "Users synced successfully" });
  } catch (error) {
    console.error("Error syncing users:", error);
    await db.rollback(); // Rollback in case of error
    res
      .status(500)
      .json({ error: "Failed to sync users", details: error.message });
  } finally {
    db.close(); // Close the session
  }
}
