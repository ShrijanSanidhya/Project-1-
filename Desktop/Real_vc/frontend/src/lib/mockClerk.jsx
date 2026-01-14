import { createContext, useContext } from "react";

// Create a mock Clerk context for development without credentials
const MockClerkContext = createContext({
    isSignedIn: false,
    isLoaded: true,
    user: null,
});

// Mock ClerkProvider for development
export const MockClerkProvider = ({ children }) => {
    const mockValue = {
        isSignedIn: false,
        isLoaded: true,
        user: null,
    };

    return (
        <MockClerkContext.Provider value={mockValue}>
            {children}
        </MockClerkContext.Provider>
    );
};

// Mock useUser hook
export const useMockUser = () => {
    return useContext(MockClerkContext);
};
