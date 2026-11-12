import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import MaintenancePage from './pages/MaintenancePage';

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
import AdminPesan from './pages/admin/AdminPesan';

// ========== IMPORT SUPABASE ==========
import { supabase } from './supabase/client';

// ========== MAINTENANCE GUARD COMPONENT ==========
function MaintenanceGuard({ children }) {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const { data } = await supabase
          .from('pengaturan_global')
          .select('key, value')
          .in('key', ['maintenance_mode']);
        
        const mode = data?.find(d => d.key === 'maintenance_mode');
        setMaintenance(mode?.value === 'true');
      } catch (error) {
        console.error('Error checking maintenance:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();

    // ===== REALTIME: Auto-update kalo admin ubah status =====
    const channel = supabase
      .channel('global-settings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pengaturan_global' }, 
        (payload) => {
          if (payload.new?.key === 'maintenance_mode') {
            setMaintenance(payload.new.value === 'true');
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-pmi border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Kalo maintenance & bukan admin = tampilin halaman maintenance
  if (maintenance && !isAdminPath) {
    return <MaintenancePage />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Analytics />
          <SpeedInsights />
          <ScrollToTop />
          <MaintenanceGuard>
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

              {/* ===== MAINTENANCE PAGE ===== */}
              <Route path="/maintenance" element={<MaintenancePage />} />

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
                <Route path="pesan" element={<AdminPesan />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </MaintenanceGuard>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;