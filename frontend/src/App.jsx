/**
 * @file App.jsx
 * @description Routeur principal de CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/auth/LoginPage';
import SignUpPage  from './pages/auth/SignUpPage';
import Dashboard   from './pages/Dashboard';
import UploadCV    from './pages/UploadCV';
import AnalysesCV  from './pages/AnalysesCV';
import JobMatching  from './pages/JobMatching';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
         <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload"  element={<UploadCV />} />
        <Route path="/analyses" element={<AnalysesCV />} />
        <Route path="/matching" element={<JobMatching />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;