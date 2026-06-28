import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
)
