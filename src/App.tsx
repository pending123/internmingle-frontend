import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NeighborhoodsPage from './pages/NeighborhoodsPage/NeighborhoodsPage';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage/LandingPage';
import Events from './pages/EventsPage/EventsPage'
import InternFinder from './pages/InternFinderPage/InternFinder';
import PublicProfilePage from './pages/PublicProfilePage/PublicProfilePage';

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
              </>
            }
          />
          <Route 
            path="/onboarding"
            element={
              <SignedIn>
                <h1>Onboarding Page</h1>
              </SignedIn>
            }
          />
          <Route 
            path="/home"
            element={
              <SignedIn>
                <h1>Home Page</h1>
              </SignedIn>
            }
          />
          <Route 
            path="/edit-profile"
            element={
              <SignedIn>
                <h1>Edit Profile</h1>
              </SignedIn>
            }
          />
          <Route 
            path="/intern-finder"
            element={
              <SignedIn>
                <InternFinder />
              </SignedIn>
            }
          />
          <Route 
            path="/public-profile/:id"
            element={
              <SignedIn>
                <PublicProfilePage />
              </SignedIn>
            }
          />
          <Route 
            path="/neighborhoods"
            element={
              <SignedIn>
                <NeighborhoodsPage />
              </SignedIn>
            }
          />
          <Route 
            path="/events"
            element={
              <SignedIn>
                <Events/>
              </SignedIn>
            }
          />
          <Route 
            path="/events/:id"
            element={
              <SignedIn>
                <h1>Individual Event</h1>
              </SignedIn>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App