import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0073EA', // Example color
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ClerkLoaded>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  </StrictMode>,
)
