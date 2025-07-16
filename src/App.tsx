import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NeighborhoodsPage from './pages/NeighborhoodsPage/NeighborhoodsPage';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>

        
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
                <SignedIn>
                  <h1>Random</h1>
                </SignedIn>
                <SignedOut>
                    <h1>Welcome</h1>
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
                <h1>Intern Finder</h1>
              </SignedIn>
            }
          />
          <Route 
            path="/public-profile/:id"
            element={
              <SignedIn>
                <h1>Public Profile</h1>
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
                <h1>Event Page</h1>
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