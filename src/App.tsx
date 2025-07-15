import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>InternMingle</h1>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>

        
        <SignedIn>
          <UserButton />
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