import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';

// ========== PUBLIC PAGES ==========
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import StrukturPage from './pages/StrukturPage';
import ProgramPage from './pages/ProgramPage';
import KegiatanPage from './pages/KegiatanPage';
import GaleriPage from './pages/GaleriPage';
import PendaftaranPage from './pages/PendaftaranPage';
import KontakPage from './pages/KontakPage';
import PendaftaranRedirect from './pages/PendaftaranRedirect';

// ========== ADMIN PAGES ==========
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStruktur from './pages/admin/AdminStruktur';
import AdminProgram from './pages/admin/AdminProgram';
import AdminKegiatan from './pages/admin/AdminKegiatan';
import AdminGaleri from './pages/admin/AdminGaleri';
import AdminSettings from './pages/admin/AdminSettings';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Analytics />
          <SpeedInsights />
          <ScrollToTop />
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="profil" element={<ProfilePage />} />
              <Route path="struktur-organisasi" element={<StrukturPage />} />
              <Route path="program-kerja" element={<ProgramPage />} />
              <Route path="kegiatan" element={<KegiatanPage />} />
              <Route path="galeri" element={<GaleriPage />} />
              <Route path="pendaftaran" element={<PendaftaranPage />} />
              <Route path="kontak" element={<KontakPage />} />
              <Route path="pendaftaran-redirect" element={<PendaftaranRedirect />} />
            </Route>

            {/* ===== ADMIN AUTH ROUTES ===== */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />

            {/* ===== ADMIN PROTECTED ROUTES ===== */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="struktur" element={<AdminStruktur />} />
              <Route path="program" element={<AdminProgram />} />
              <Route path="kegiatan" element={<AdminKegiatan />} />
              <Route path="galeri" element={<AdminGaleri />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;