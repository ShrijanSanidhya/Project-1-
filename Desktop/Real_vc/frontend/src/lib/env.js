// Helper to check if Clerk is configured
export const isClerkConfigured = () => {
    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return PUBLISHABLE_KEY && !PUBLISHABLE_KEY.startsWith("your_");
};
