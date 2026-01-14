import mongoose from "mongoose";

import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async (retries = 3) => {
  // If already connected, return early
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Already connected to MongoDB");
    return true;
  }

  try {
    if (!ENV.DB_URL) {
      console.warn("⚠️  DB_URL is not defined in environment variables");
      console.warn("⚠️  Server will start without database connection");
      console.warn("⚠️  Database-dependent features will not work");
      return false;
    }

    console.log("🔄 Connecting to MongoDB...");
    const conn = await mongoose.connect(ENV.DB_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    isConnected = true;
    console.log("✅ Connected to MongoDB:", conn.connection.host);
    return true;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      return connectDB(retries - 1);
    }

    console.warn("⚠️  Failed to connect to MongoDB after multiple attempts");
    console.warn("⚠️  Server will start without database connection");
    console.warn("⚠️  Please check your DB_URL in .env file");
    return false;
  }
};

// Check if database is connected
export const isDBConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};
