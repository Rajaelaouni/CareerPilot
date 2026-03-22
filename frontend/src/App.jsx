/**
 * @file App.jsx
 * @description Routeur principal de CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 *
 * Routes disponibles :
 * /           → Landing Page
 * /login      → Page de connexion
 * /signup     → Inscription (étapes 1 & 2)
 * /dashboard  → Dashboard (protégé)
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/auth/LoginPage';
import SignUpPage  from './pages/auth/SignUpPage';
/**
 * Composant temporaire pour les pages non encore développées
 */
function ComingSoon({ page }) {
  return (
    <div style={{
      minHeight:"100vh", display:"flex",
      flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"#F8F7FF",
      fontFamily:"'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🚀</div>
      <h1 style={{ color:"#C8187A", fontFamily:"'Syne',sans-serif", margin:"0 0 8px" }}>
        {page}
      </h1>
      <p style={{ color:"#8B7AA8" }}>Page en cours de développement</p>
      <a href="/login" style={{ color:"#C8187A", marginTop:16 }}>← Retour au login</a>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Plus+Jakarta+Sans:wght@400&display=swap');`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection racine vers login */}
        <Route path="/"          element={<Navigate to="/login" replace />} />

        {/* Authentification */}
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/signup"    element={<SignUpPage />} />

        {/* Pages à développer */}
        <Route path="/dashboard" element={<ComingSoon page="Dashboard" />} />
        <Route path="/upload"    element={<ComingSoon page="Upload CV" />} />
        <Route path="/matching"  element={<ComingSoon page="Job Matching" />} />

        {/* 404 */}
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}