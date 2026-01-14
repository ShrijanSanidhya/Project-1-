import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";

function App() {
  const [clerkAvailable, setClerkAvailable] = useState(true);
  let isSignedIn = false;
  let isLoaded = false;

  try {
    const clerkUser = useUser();
    isSignedIn = clerkUser.isSignedIn;
    isLoaded = clerkUser.isLoaded;
  } catch (error) {
    // Clerk is not configured or failed to load
    console.warn("Clerk not available:", error.message);
    if (clerkAvailable) {
      setClerkAvailable(false);
    }
    isLoaded = true; // Skip loading when Clerk isn't available
    isSignedIn = false;
  }

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
