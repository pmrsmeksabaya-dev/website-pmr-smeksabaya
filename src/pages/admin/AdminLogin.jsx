import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      navigate('/admin');
    } catch (err) {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pmi/20 via-white to-white dark:via-gray-900 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pmi/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-pmi" />
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">PMR Wira SMKN 1 Pringgabaya</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded" />
              <span className="text-sm">Remember Me</span>
            </label>
            <a href="#" className="text-sm text-pmi hover:underline">Lupa Password?</a>
          </div>

          <button type="submit" className="w-full bg-pmi text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;