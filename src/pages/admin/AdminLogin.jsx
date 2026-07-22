import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, Eye, EyeOff, Shield, Sparkles, Fingerprint, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoPmr from '../../assets/pmr.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // ========== REMEMBER ME ==========
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ========== KEYBOARD SHORTCUT ==========
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !loading) {
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [email, password, loading]);

  // ========== VALIDASI ==========
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email wajib diisi';
    if (email && !email.includes('@')) newErrors.email = 'Email tidak valid';
    if (!password) newErrors.password = 'Password wajib diisi';
    if (password && password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== SUBMIT ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setLoading(true);
    setLoginAttempts(prev => prev + 1);
    
    try {
      await login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }
      
      navigate('/admin');
    } catch (err) {
      setError('Email atau password salah. Silakan coba lagi.');
      // Kalo gagal 3x, kasih pesan tambahan
      if (loginAttempts >= 2) {
        setError('Email atau password salah. Silakan coba lagi atau reset password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ========== DEMO CREDENTIALS ==========
  const fillDemoCredentials = () => {
    setEmail('pmrsmeksabaya@gmail.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pmi/20 via-white to-white dark:via-gray-900 dark:to-gray-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pmi/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-maroon/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pmi/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative z-10 border border-gray-100 dark:border-gray-700"
      >
        {/* ===== HEADER ===== */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-pmi/20 to-maroon/20 rounded-full flex items-center justify-center mx-auto mb-4 relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pmi/10 to-maroon/10 animate-pulse"></div>
            <Heart className="w-10 h-10 text-pmi relative z-10" />
            <div className="absolute -top-1 -right-1 bg-pmi/10 rounded-full p-1 z-10">
              <Shield className="w-4 h-4 text-pmi/60" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            PMR Wira SMKN 1 Pringgabaya
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto mt-3 rounded-full" />
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error umum */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200 dark:border-red-800"
            >
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              placeholder="admin@example.com"
              required
              autoFocus
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({});
                }}
                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition pr-10 ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-700'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pmi transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)} 
                className="rounded border-gray-300 dark:border-gray-600 text-pmi focus:ring-pmi accent-pmi w-4 h-4"
              />
              <span className="group-hover:text-pmi transition">Ingat Saya</span>
            </label>
            <Link 
              to="/admin/forgot-password" 
              className="text-sm text-pmi hover:underline transition hover:text-red-700 flex items-center gap-0.5"
            >
              Lupa Password?
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-pmi to-red-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> 
                Memproses...
              </>
            ) : (
              <>
                <Fingerprint size={18} className="group-hover:rotate-12 transition" />
                Login
              </>
            )}
          </motion.button>

          {/* Demo Credentials (for testing) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full text-xs text-gray-400 hover:text-pmi transition py-1"
            >
              🔑 Isi demo credentials
            </button>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              Protected by Supabase Auth • PMR Wira SMKN 1 Pringgabaya
            </p>
            <p className="text-center text-[10px] text-gray-300 dark:text-gray-600 mt-1">
              v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;