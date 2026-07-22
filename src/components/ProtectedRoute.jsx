import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, userRole } = useAuth();

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-pmi" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-500 dark:text-gray-400 text-sm"
        >
          Memuat data pengguna...
        </motion.p>
      </div>
    );
  }

  // ========== NOT LOGGED IN ==========
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ========== ROLE CHECK ==========
  if (requiredRole && userRole !== requiredRole) {
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Akses Ditolak
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
          Anda tidak memiliki izin untuk mengakses halaman ini.
          Hubungi administrator jika Anda memerlukan akses.
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

  // ========== AUTHORIZED ==========
  return children;
};

export default ProtectedRoute;