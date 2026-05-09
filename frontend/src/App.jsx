import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/auth/LoginPage';
import SignUpPage  from './pages/auth/SignUpPage';
import Dashboard   from './pages/Dashboard';
import UploadCV    from './pages/UploadCV';
import AnalysesCV  from './pages/AnalysesCV';
import JobMatching from './pages/JobMatching';
import Parametres  from './pages/Parametres';
import Profil      from './pages/Profil';
import CVOptimise  from './pages/CVOptimise';
import Entretien   from './pages/Entretien';
import { AppSettingsProvider } from "./context/AppSettingsContext";

import ProtectedRoute from "./routes/ProtectedRoute"; // 👈 AJOUT

function App() {
  return (
    <AppSettingsProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* 🔒 Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadCV />
            </ProtectedRoute>
          } />

          <Route path="/analyses" element={
            <ProtectedRoute>
              <AnalysesCV />
            </ProtectedRoute>
          } />

          <Route path="/parametres" element={
            <ProtectedRoute>
              <Parametres />
            </ProtectedRoute>
          } />

          <Route path="/profil" element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          } />

          <Route path="/matching" element={
            <ProtectedRoute>
              <JobMatching />
            </ProtectedRoute>
          } />

          <Route path="/optimise" element={
            <ProtectedRoute>
              <CVOptimise />
            </ProtectedRoute>
          } />

          <Route path="/entretien" element={
            <ProtectedRoute>
              <Entretien />
            </ProtectedRoute>
          } />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AppSettingsProvider>
  );
}

export default App;