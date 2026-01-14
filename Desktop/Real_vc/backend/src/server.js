import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Public routes (no authentication required)
app.get("/health", async (req, res) => {
  const { isDBConnected } = await import("./lib/db.js");
  res.status(200).json({
    status: "ok",
    message: "API is up and running",
    services: {
      database: isDBConnected() ? "connected" : "disconnected",
      server: "running"
    },
    timestamp: new Date().toISOString()
  });
});

// Apply Clerk authentication middleware for protected routes
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    // Try to connect to database (won't crash if it fails)
    const dbConnected = await connectDB();

    // Start the server regardless of DB connection status
    app.listen(ENV.PORT, () => {
      console.log("\n🚀 ========================================");
      console.log(`🚀 Server is running on port: ${ENV.PORT}`);
      console.log(`🚀 Environment: ${ENV.NODE_ENV}`);
      console.log("🚀 ========================================");
      console.log("\n📊 Service Status:");
      console.log(`   Database: ${dbConnected ? "✅ Connected" : "❌ Disconnected"}`);
      console.log(`   Health Check: http://localhost:${ENV.PORT}/health`);
      console.log("🚀 ========================================\n");
    });
  } catch (error) {
    console.error("💥 Fatal error starting the server:", error);
    process.exit(1);
  }
};

startServer();
