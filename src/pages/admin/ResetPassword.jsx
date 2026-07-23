// src/pages/admin/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidToken, setIsValidToken] = useState(true);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // ========== CEK TOKEN VALID ==========
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      console.log('🔐 Session check:', data?.session ? '✅ Valid' : '❌ Invalid');
      
      if (error || !data.session) {
        setIsValidToken(false);
        setError('Link reset password tidak valid atau sudah kadaluarsa.');
      }
    };
    checkSession();
  }, []);

  // ========== VALIDASI ==========
  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = 'Password wajib diisi';
    if (password && password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    if (!confirmPassword) newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== SUBMIT ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await resetPassword(password);
      setSuccess(true);
      
      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err) {
      console.error('Error reset password:', err);
      setError(err.message || 'Gagal mereset password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // ========== PASSWORD STRENGTH ==========
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-pmi animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Memproses...</p>
        </div>
      </div>
    );
  }

  // ========== TOKEN TIDAK VALID ==========
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Link Tidak Valid
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Link 
            to="/admin/forgot-password" 
            className="inline-flex items-center gap-2 bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <ArrowLeft size={18} />
            Minta Link Baru
          </Link>
        </motion.div>
      </div>
    );
  }

  // ========== FORM RESET PASSWORD ==========
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pmi/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-pmi" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Buat password baru untuk akun Anda
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-4 flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Password Berhasil Diubah!</p>
                <p className="text-sm">
                  Mengalihkan ke halaman login...
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Password Baru */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password Baru
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
                placeholder="Minimal 6 karakter"
                required
                disabled={success}
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
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        i < strength ? strengthColors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1 font-medium ${
                  strength <= 1 ? 'text-red-500' :
                  strength === 2 ? 'text-orange-500' :
                  strength === 3 ? 'text-yellow-600' :
                  'text-green-500'
                }`}>
                  {strengthLabels[strength - 1] || ''}
                </p>
              </div>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({});
                }}
                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition pr-10 ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-700'
                }`}
                placeholder="Masukkan ulang password"
                required
                disabled={success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pmi transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              success
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-pmi text-white hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> 
                Menyimpan...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Berhasil!
              </>
            ) : (
              'Simpan Password Baru'
            )}
          </button>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-pmi transition"
            >
              <ArrowLeft size={16} />
              Kembali ke Login
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Protected by Supabase Auth • PMR Wira SMKN 1 Pringgabaya
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;