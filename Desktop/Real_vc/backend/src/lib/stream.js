import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

// Helper to check if credentials are valid
const hasValidCredentials = () => {
  return apiKey && apiSecret && !apiKey.startsWith("your_") && !apiSecret.startsWith("your_");
};

// Only initialize clients if credentials are valid
let chatClient = null;
let streamClient = null;

if (hasValidCredentials()) {
  try {
    chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used for chat features
    streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls
    console.log("✅ Stream clients initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Stream clients:", error.message);
  }
} else {
  console.warn("⚠️  Stream API credentials not configured - chat/video features disabled");
}

export { chatClient, streamClient };

export const upsertStreamUser = async (userData) => {
  if (!chatClient) {
    console.warn("⚠️  Cannot upsert Stream user - Stream client not initialized");
    return;
  }

  try {
    await chatClient.upsertUser(userData);
    console.log("✅ Stream user upserted successfully:", userData.id);
  } catch (error) {
    console.error("❌ Error upserting Stream user:", error.message);
  }
};

export const deleteStreamUser = async (userId) => {
  if (!chatClient) {
    console.warn("⚠️  Cannot delete Stream user - Stream client not initialized");
    return;
  }

  try {
    await chatClient.deleteUser(userId);
    console.log("✅ Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("❌ Error deleting Stream user:", error.message);
  }
};
