// src/pages/admin/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { forgotPassword } = useAuth(); // <-- pake dari context

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email wajib diisi';
    if (email && !email.includes('@')) newErrors.email = 'Email tidak valid';
    if (email && !email.includes('.')) newErrors.email = 'Email tidak valid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Error reset password:', err);
      setError(err.message || 'Gagal mengirim email reset password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pmi/20 via-white to-white dark:via-gray-900 dark:to-gray-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pmi/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-maroon/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative z-10 border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-pmi/20 to-maroon/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Mail className="w-10 h-10 text-pmi" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
            Lupa Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Kirim link reset password ke email Anda
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto mt-3 rounded-full" />
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
                <p className="font-semibold">Email Terkirim!</p>
                <p className="text-sm">
                  Link reset password telah dikirim ke <strong>{email}</strong>. 
                  Cek inbox atau folder spam Anda.
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-700'
                }`}
                placeholder="admin@example.com"
                required
                disabled={success}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Info Text */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              📧 Kami akan mengirimkan link untuk mereset password Anda.
              Link hanya berlaku selama 1 jam.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              success
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-gradient-to-r from-pmi to-red-600 text-white hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> 
                Mengirim...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Email Terkirim!
              </>
            ) : (
              <>
                <Send size={18} />
                Kirim Link Reset
              </>
            )}
          </motion.button>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-pmi transition group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
              Kembali ke Login
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Protected by Supabase Auth • PMR Wira SMKN 1 Pringgabaya
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;