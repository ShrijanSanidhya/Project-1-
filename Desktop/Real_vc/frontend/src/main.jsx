import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if Clerk key is valid (not missing and not a placeholder)
const isClerkConfigured = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.startsWith("your_");

if (!isClerkConfigured) {
  console.warn("⚠️  Clerk Publishable Key is not configured");
  console.warn("⚠️  Authentication features will be disabled");
  console.warn("⚠️  Set VITE_CLERK_PUBLISHABLE_KEY in frontend/.env to enable authentication");
}

// Use a dummy key if not configured (Clerk requires a key format)
// This allows the app to render but authentication won't work
const clerkKey = isClerkConfigured ? PUBLISHABLE_KEY : "pk_test_ZHVtbXkta2V5LWZvci1kZXZlbG9wbWVudA";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {!isClerkConfigured && (
          <div style={{
            background: '#ff6b35',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999
          }}>
            ⚠️ Authentication Disabled - Configure VITE_CLERK_PUBLISHABLE_KEY in .env
          </div>
        )}
        {isClerkConfigured ? (
          <ClerkProvider publishableKey={clerkKey}>
            <div style={{ marginTop: '0' }}>
              <App />
            </div>
          </ClerkProvider>
        ) : (
          <div style={{ marginTop: '40px' }}>
            <App />
          </div>
        )}
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
