import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LayoutDashboard, Users, Calendar, Image, Settings, 
  LogOut, Sun, Moon, Activity, Home, ChevronLeft, ChevronRight,
  Shield, Sparkles, Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabaseAdmin } from '../supabase/adminClient';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ========== CEK LAYAR ==========
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ========== FETCH UNREAD MESSAGES ==========
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data, error, count } = await supabaseAdmin
          .from('pesan')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'baru');

        if (error) throw error;
        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnread();

    // ===== REALTIME - DI COMMENT DULU BIAR GAK ERROR =====
    // const channel = supabaseAdmin
    //   .channel('admin-pesan-realtime')
    //   .on('postgres_changes', {
    //     event: 'INSERT',
    //     schema: 'public',
    //     table: 'pesan'
    //   }, () => {
    //     fetchUnread();
    //   })
    //   .on('postgres_changes', {
    //     event: 'UPDATE',
    //     schema: 'public',
    //     table: 'pesan'
    //   }, () => {
    //     fetchUnread();
    //   })
    //   .subscribe();

    // return () => {
    //   supabaseAdmin.removeChannel(channel);
    // };
  }, []);

  // ========== MENU ITEMS ==========
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/struktur', icon: Users, label: 'Kelola Struktur' },
    { path: '/admin/program', icon: Calendar, label: 'Kelola Program' },
    { path: '/admin/kegiatan', icon: Activity, label: 'Kelola Kegiatan' },
    { path: '/admin/galeri', icon: Image, label: 'Kelola Galeri' },
    { path: '/admin/pesan', icon: Mail, label: 'Pesan Masuk', badge: unreadCount },
    { path: '/admin/settings', icon: Settings, label: 'Pengaturan' },
  ];

  // ========== LOGOUT ==========
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // ========== IS ACTIVE ==========
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ========== MOBILE HEADER ========== */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <Menu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pmi to-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-white">Admin</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      {/* ========== MOBILE OVERLAY ========== */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ========== SIDEBAR ========== */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* ===== LOGO ===== */}
        <div className="flex-shrink-0 p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pmi to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-800 dark:text-white truncate">Admin Panel</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">PMR Wira SMKN 1 Pringgabaya</p>
            </div>
          </div>
        </div>

        {/* ===== MENU ===== */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative ${
                  active 
                    ? 'bg-pmi text-white shadow-lg shadow-pmi/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon size={18} className={active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-pmi'} />
                <span className="text-sm sm:text-base font-medium">{item.label}</span>
                
                {/* ===== BADGE UNREAD ===== */}
                {item.badge > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    active 
                      ? 'bg-white text-pmi' 
                      : 'bg-pmi text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
                
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-6 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ===== BOTTOM ===== */}
        <div className="flex-shrink-0 p-3 border-t dark:border-gray-700 space-y-1 bg-white dark:bg-gray-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition w-full group"
          >
            {theme === 'light' ? (
              <>
                <Moon size={18} className="text-indigo-500" />
                <span className="text-sm sm:text-base">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={18} className="text-yellow-500" />
                <span className="text-sm sm:text-base">Light Mode</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full group"
          >
            <LogOut size={18} className="group-hover:rotate-180 transition duration-300" />
            <span className="text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="md:ml-72 pt-14 md:pt-0 px-3 sm:px-4 md:px-6 py-4 sm:py-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;