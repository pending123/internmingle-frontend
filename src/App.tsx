import './App.css'
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
                <SignedIn>
                  <Navigate to="/intern-finder" replace /> //what does replace do
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
              <ProtectedRoute>
                <h1>Home Page</h1>
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
              <SignedIn>
                <PublicProfilePage />
              </SignedIn>
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
                <Events/>
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
  )
}

export default App