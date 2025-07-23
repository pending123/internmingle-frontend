import "./App.css";
import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import NeighborhoodsPage from './pages/NeighborhoodsPage/NeighborhoodsPage';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Events from './pages/EventsPage/EventsPage'
import InternFinder from './pages/InternFinderPage/InternFinder';
import HomePage from './pages/HomePage/HomePage';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import PublicProfilePage from './pages/PublicProfilePage/PublicProfilePage';


// Configure axios base URL to point to your backend //look into this
axios.defaults.baseURL = "http://localhost:3000";

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
        //CLAUDE SUGGESTED.. makes sure your user is authenticated
        return;
      }

      try {
        // get token using useAuth hook
        const token = await getToken();

        if (!token) {
          console.error("No authentication token available");
          setProfileCompleted(false);
          setIsCheckingProfile(false); //ask about what setischeckingprofile does
          return;
        }
        console.log("hit line 47");
        const response = await axios.get("/api/profiles/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);

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
        console.log("setIsCheckingProfile(false);");
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
    return <div>Loading...</div>;
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
                  <LandingPage />
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
            path="/events/:id"
            element={
              <ProtectedRoute>
                <h1>Individual Event</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
