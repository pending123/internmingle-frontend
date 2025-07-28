import "./App.css";
import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import NeighborhoodsPage from "./pages/NeighborhoodsPage/NeighborhoodsPage";
import Navbar from "./components/Navbar/Navbar";
import Events from "./pages/EventsPage/EventsPage";
import InternFinder from "./pages/InternFinderPage/InternFinder";
import HomePage from "./pages/HomePage/HomePage";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import PublicProfilePage from "./pages/PublicProfilePage/PublicProfilePage";
import Event from "./pages/EventsPage/event"
import PersonalProfilePage from "./pages/PersonalProfilePage/PersonalProfilePage";
import ChatPage from "./pages/ChatPage/ChatPage";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = BACKEND_URL;

// Checks if profile is complted
function ProfileCompletionChecker({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(
    null
  );
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  //makes sure profile is completed before proceeding
  useEffect(() => {
    const checkProfileCompletion = async () => {
      console.log("TEST");
      if (!isLoaded || !user) {
        console.log("!isLoaded || !user");
        return;
      }
      try {
        // get token using useAuth hook
        const token = await getToken();
        console.log("token", token);
        if (!token) {
          console.error("No authentication token available");
          setProfileCompleted(false);
          setIsCheckingProfile(false); //ask about what setischeckingprofile does
          return;
        }
        const response = await axios.get("/api/profiles/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if profile exists and is completed
        const profileData = response.data;
        const isCompleted =
          profileData && profileData.profileCompleted === true;

        console.log("Profile found:", {
          profileExists: Boolean(profileData),
          profileCompleted: profileData?.profileCompleted, //why ?
          isCompleted,
        });

        setProfileCompleted(isCompleted);
      } catch (error) {
        // 404 is expected for new users
        console.log(
          "New user detected - profile needs to be created or profile not found"
        );
        setProfileCompleted(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };
    checkProfileCompletion();
  }, [user, isLoaded, getToken]);
  // Show loading state while checking profile
  if (isCheckingProfile || !isLoaded) {
    console.log(
      `isCheckingProfile = ${isCheckingProfile} || !isLoaded = ${!isLoaded}`
    );
    return <div><CircularProgress /></div>;
  }
  // if profile is not completed, redirect to onboarding
  if (profileCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}
// Protected route makes sure that user has completed onboarding first
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <SignedIn>
      <ProfileCompletionChecker>{children}</ProfileCompletionChecker>
    </SignedIn>
  );
}
function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedIn>
          <Navbar />
        </SignedIn>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <HomePage />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/intern-finder" replace /> //what does replace
                  do
                </SignedIn>
              </>
            }
          />
          <Route
            path="/onboarding"
            element={
              <SignedIn>
                <OnboardingPage />
              </SignedIn>
            }
          />
          {/* Protected routes bc that requires that a user's profile be completed first*/}
          <Route
            path="/home"
            element={
              <SignedIn>
                <HomePage />
              </SignedIn>
            }
          />
          <Route
            path="/profiles/me" 
            element={
              <ProtectedRoute>
                <PersonalProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <h1>Edit Profile</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="/intern-finder"
            element={
              <ProtectedRoute>
                <InternFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/public-profile/:id"
            element={
              <ProtectedRoute>
                <PublicProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/neighborhoods"
            element={
              <ProtectedRoute>
                <NeighborhoodsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId"
            element={
              <ProtectedRoute>
                <Event/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatPage/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
