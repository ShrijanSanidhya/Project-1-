import dotenv from "dotenv";

dotenv.config({ quiet: true });

// Helper function to check if a value is set and not a placeholder
const isValidEnvValue = (value) => {
  return value && !value.startsWith("your_");
};

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};

// Log configuration status (without exposing secrets)
console.log("\n🔧 Environment Configuration:");
console.log(`   PORT: ${ENV.PORT}`);
console.log(`   NODE_ENV: ${ENV.NODE_ENV}`);
console.log(`   CLIENT_URL: ${ENV.CLIENT_URL}`);
console.log(`   DB_URL: ${isValidEnvValue(ENV.DB_URL) ? "✅ Configured" : "❌ Missing"}`);
console.log(`   STREAM_API_KEY: ${isValidEnvValue(ENV.STREAM_API_KEY) ? "✅ Configured" : "❌ Missing"}`);
console.log(`   STREAM_API_SECRET: ${isValidEnvValue(ENV.STREAM_API_SECRET) ? "✅ Configured" : "❌ Missing"}`);
console.log(`   INNGEST_EVENT_KEY: ${isValidEnvValue(ENV.INNGEST_EVENT_KEY) ? "✅ Configured" : "❌ Missing"}`);
console.log(`   INNGEST_SIGNING_KEY: ${isValidEnvValue(ENV.INNGEST_SIGNING_KEY) ? "✅ Configured" : "❌ Missing"}`);
console.log("");

// Warn about missing critical services
if (!isValidEnvValue(ENV.DB_URL)) {
  console.warn("⚠️  Warning: DB_URL not configured - database features will be unavailable");
}
if (!isValidEnvValue(ENV.STREAM_API_KEY) || !isValidEnvValue(ENV.STREAM_API_SECRET)) {
  console.warn("⚠️  Warning: Stream API credentials not configured - chat/video features will be unavailable");
}
if (!isValidEnvValue(ENV.INNGEST_EVENT_KEY) || !isValidEnvValue(ENV.INNGEST_SIGNING_KEY)) {
  console.warn("⚠️  Warning: Inngest credentials not configured - background jobs will be unavailable");
}

