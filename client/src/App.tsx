import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ClubProvider } from './context/ClubContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EventsPage } from './pages/EventsPage';
import { ClubsPage } from './pages/ClubsPage';
import { ClubDetailPage } from './pages/ClubDetailPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { MyPassesPage } from './pages/MyPassesPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';
import { ClubAdminPage } from './pages/ClubAdminPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { CampusConciergeChat } from './components/CampusConciergeChat';

import { Building2, Heart, Sparkles } from 'lucide-react';

export function App() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ClubProvider>
        <BrowserRouter>
          <div className="noise" aria-hidden="true" />
          <div className="progress" style={{ width: `${scrollProgress}%` }} />

          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top 1-Click Multi-Role Demo Switcher Bar */}
            <RoleSwitcherBar />

            {/* Main Navigation Bar */}
            <Navbar />

            {/* Main Route Content */}
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/clubs" element={<ClubsPage />} />
                <Route path="/clubs/:slug" element={<ClubDetailPage />} />
                <Route path="/verify/:certificateId" element={<CertificateVerifyPage />} />
                <Route path="/certificates" element={<Navigate to="/my-certificates" replace />} />

              {/* Protected Student Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <StudentProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-passes"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                    <MyPassesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-certificates"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
                    <CertificatesPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Club Admin Route */}
              <Route
                path="/club-admin"
                element={
                  <ProtectedRoute allowedRoles={['CLUB_ADMIN', 'SUPER_ADMIN']}>
                    <ClubAdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Super Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                    <SuperAdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Editorial Brutalist Footer from Reference */}
          <footer className="footer-editorial" style={{ marginTop: 'auto' }}>
            <span>© {new Date().getFullYear()} CampusSphere Platform</span>
            <span>Arya College of Engineering & IT (ACEIT), Jaipur · 15 Clubs · AICTE Points Ledger</span>
            <span>B.Tech · M.Tech · MBA · MCA · RTU Affiliated</span>
          </footer>

          {/* Global Floating AI Concierge Chatbot */}
          <CampusConciergeChat />
        </div>
      </BrowserRouter>
      </ClubProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
