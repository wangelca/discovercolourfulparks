import { PrismaClient } from '@prisma/client';
import { createClerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default async function handler(req, res) {
  try {
    // Fetch all users from Clerk using the SDK

    const { data: userList } = await clerkClient.users.getUserList();

    const response = await clerkClient.users.getUserList();


<<<<<<< HEAD
=======
    // Assuming the user list is nested in `response.data` or similar
    const userList = response.users || response.data || [];

    // Check if userList is iterable
    if (!Array.isArray(userList)) {
      return res.status(500).json({ error: "Invalid response from Clerk API: userList is not an array", response });
    }

    if (userList.length === 0) {
      return res.status(200).json({ message: "No users found in Clerk." });
    }

    // Loop through Clerk users and upsert them into your PostgreSQL database
    for (const user of userList) {
      const email = user.emailAddresses && user.emailAddresses.length > 0
        ? user.emailAddresses[0].emailAddress
        : "";

      const phoneNumber = user.phoneNumbers && user.phoneNumbers.length > 0
        ? user.phoneNumbers[0].phoneNumber
        : "";

      const publicMetadata =
        typeof user.publicMetadata === "object"
          ? JSON.stringify(user.publicMetadata)
          : user.publicMetadata || null;

      await prisma.user.upsert({
        where: { clerk_user_id: user.id }, // Correct Clerk user ID reference
        update: {
          email: email || "",
          publicMetadata: publicMetadata,
        },
        create: {
          clerk_user_id: user.id,
          username: user.username || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: phoneNumber || "",
          email: email || "",
          publicMetadata: publicMetadata,
        },
      });
    }

    res.status(200).json({ message: "Users synced successfully" });
  } catch (error) {
    console.error("Error syncing users:", error);
    res.status(500).json({ error: "Failed to sync users", details: error.message });
  }
}

import { PrismaClient } from '@prisma/client';
import { createClerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default async function handler(req, res) {
  try {
    // Fetch all users from Clerk using the SDK
    const { data: userList } = await clerkClient.users.getUserList();

>>>>>>> a4c79216975052569aa4765de00e518f6997dc2b
    // Assuming the user list is nested in `response.data` or similar
    const userList = response.users || response.data || [];

    // Check if userList is iterable
    if (!Array.isArray(userList)) {
      return res.status(500).json({ error: "Invalid response from Clerk API: userList is not an array", response });
    }

    if (userList.length === 0) {
      return res.status(200).json({ message: "No users found in Clerk." });
    }

    // Loop through Clerk users and upsert them into your PostgreSQL database
    for (const user of userList) {
      const email = user.emailAddresses && user.emailAddresses.length > 0
        ? user.emailAddresses[0].emailAddress
        : "";

      const phoneNumber = user.phoneNumbers && user.phoneNumbers.length > 0
        ? user.phoneNumbers[0].phoneNumber
        : "";

      const publicMetadata =
        typeof user.publicMetadata === "object"
          ? JSON.stringify(user.publicMetadata)
          : user.publicMetadata || null;

      await prisma.user.upsert({
        where: { clerk_user_id: user.id }, // Correct Clerk user ID reference
        update: {
          email: email || "",
          publicMetadata: publicMetadata,
        },
        create: {
          clerk_user_id: user.id,
          username: user.username || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: phoneNumber || "",
          email: email || "",
          publicMetadata: publicMetadata,
        },
      });
    }

    res.status(200).json({ message: "Users synced successfully" });
  } catch (error) {
    console.error("Error syncing users:", error);
    res.status(500).json({ error: "Failed to sync users", details: error.message });
  }
}
