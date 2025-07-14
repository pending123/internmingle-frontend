import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
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
  )
}

export default App

