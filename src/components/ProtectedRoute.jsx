// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, userRole } = useAuth();

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <Loader2 className="w-12 h-12 text-pmi" />
        </motion.div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Memuat data pengguna...</p>
      </div>
    );
  }

  // ========== NOT LOGGED IN ==========
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ========== ALLOWED ROLES ==========
  const allowedRoles = ['owner', 'admin', 'superadmin'];
  
  // ========== KALO USERROLE NULL ATAU GA ADA, ALLOW ==========
  if (!userRole) {
    console.warn('⚠️ No userRole found, allowing access');
    return children;
  }
  
  // ========== CEK ROLE ==========
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4"
        >
          <Shield size={40} className="text-red-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Akses Ditolak</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <button
          onClick={() => window.location.href = '/admin'}
          className="mt-6 px-6 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;