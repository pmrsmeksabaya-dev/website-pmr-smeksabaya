import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, FileText, Image, TrendingUp, Activity, 
  Plus, LogOut, RefreshCw, AlertCircle, X, BarChart3,
  Award, Clock, Zap, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pengurus: 0,
    program: 0,
    kegiatan: 0,
    galeri: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // ========== REAL-TIME CLOCK ==========
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ========== FORMAT WAKTU WITA ==========
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Makassar'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Makassar' 
    });
  };

  // ========== FETCH DATA ==========
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [pengurusRes, programRes, kegiatanRes, galeriRes] = await Promise.all([
        supabase.from('pengurus').select('*', { count: 'exact', head: true }),
        supabase.from('program_kerja').select('*', { count: 'exact', head: true }),
        supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
        supabase.from('galeri').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        pengurus: pengurusRes.count || 0,
        program: programRes.count || 0,
        kegiatan: kegiatanRes.count || 0,
        galeri: galeriRes.count || 0,
      });

      // Fetch recent activities
      const activities = [];

      const { data: pengurusRecent } = await supabase
        .from('pengurus')
        .select('nama, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (pengurusRecent && pengurusRecent.length > 0) {
        activities.push({
          action: `Menambah pengurus: ${pengurusRecent[0].nama}`,
          time: new Date(pengurusRecent[0].created_at),
          user: 'Admin',
          icon: Users
        });
      }

      const { data: programRecent } = await supabase
        .from('program_kerja')
        .select('judul, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (programRecent && programRecent.length > 0) {
        activities.push({
          action: `Menambah program: ${programRecent[0].judul}`,
          time: new Date(programRecent[0].created_at),
          user: 'Admin',
          icon: Calendar
        });
      }

      const { data: kegiatanRecent } = await supabase
        .from('kegiatan')
        .select('judul, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (kegiatanRecent && kegiatanRecent.length > 0) {
        activities.push({
          action: `Menambah kegiatan: ${kegiatanRecent[0].judul}`,
          time: new Date(kegiatanRecent[0].created_at),
          user: 'Admin',
          icon: Activity
        });
      }

      const { data: galeriRecent } = await supabase
        .from('galeri')
        .select('judul, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (galeriRecent && galeriRecent.length > 0) {
        activities.push({
          action: `Menambah galeri: ${galeriRecent[0].judul}`,
          time: new Date(galeriRecent[0].created_at),
          user: 'Admin',
          icon: Image
        });
      }

      activities.sort((a, b) => b.time - a.time);
      setRecentActivities(activities.slice(0, 5));
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== REALTIME SUBSCRIPTION ==========
  useEffect(() => {
    fetchAllData();

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengurus' }, () => {
        console.log('📢 Pengurus berubah, refresh data...');
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'program_kerja' }, () => {
        console.log('📢 Program Kerja berubah, refresh data...');
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kegiatan' }, () => {
        console.log('📢 Kegiatan berubah, refresh data...');
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'galeri' }, () => {
        console.log('📢 Galeri berubah, refresh data...');
        fetchAllData();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pengurus' }, (payload) => {
        setNotifications(prev => [
          { message: `📌 Pengurus baru: ${payload.new.nama}`, time: new Date() },
          ...prev.slice(0, 4)
        ]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ========== LOGOUT ==========
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // ========== QUICK ACTION ==========
  const handleQuickAction = (path) => {
    navigate(path);
  };

  // ========== FORMAT WAKTU RELATIF ==========
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  // ========== STAT CARDS ==========
  const statCards = [
    { 
      title: 'Total Pengurus', 
      value: stats.pengurus, 
      icon: Users, 
      color: 'bg-blue-500',
      path: '/admin/struktur',
      change: '+12%'
    },
    { 
      title: 'Program Kerja', 
      value: stats.program, 
      icon: Calendar, 
      color: 'bg-green-500',
      path: '/admin/program',
      change: '+8%'
    },
    { 
      title: 'Kegiatan', 
      value: stats.kegiatan, 
      icon: Activity, 
      color: 'bg-yellow-500',
      path: '/admin/kegiatan',
      change: '+5%'
    },
    { 
      title: 'Galeri', 
      value: stats.galeri, 
      icon: Image, 
      color: 'bg-purple-500',
      path: '/admin/galeri',
      change: '+10%'
    },
  ];

  const total = stats.pengurus + stats.program + stats.kegiatan + stats.galeri;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-pmi border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* ========== HEADER ========== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Zap className="text-pmi" size={20} />
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Selamat datang di panel admin PMR Wira
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* ===== REAL-TIME CLOCK ===== */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-center border border-gray-200 dark:border-gray-600 flex-1 sm:flex-none min-w-[120px] sm:min-w-[140px]">
            <p className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ⏰ Waktu Server
            </p>
            <p className="text-xs sm:text-sm font-mono font-bold text-pmi">
              {formatTime(currentTime)} <span className="animate-pulse">WITA</span>
            </p>
            <p className="text-[8px] sm:text-[10px] text-gray-400 hidden sm:block">
              {formatDate(currentTime)}
            </p>
          </div>

          {/* ===== LIVE INDICATOR ===== */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-green-50 dark:bg-green-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500" />
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400">Live</span>
          </div>

          {/* ===== LAST UPDATED ===== */}
          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden md:inline">
            Last update: {lastUpdated.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>

          {/* ===== REFRESH BUTTON ===== */}
          <button
            onClick={fetchAllData}
            className="px-2.5 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-1 group"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition duration-500" />
            <span className="hidden xs:inline">Refresh</span>
          </button>

          {/* ===== LOGOUT BUTTON ===== */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs sm:text-sm"
          >
            <LogOut size={14} /> 
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* ========== TOTAL DATA CARD ========== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pmi to-maroon rounded-xl p-4 sm:p-6 text-white mb-4 sm:mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm opacity-80">Total Seluruh Data</p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{total}</p>
            <p className="text-[10px] sm:text-xs opacity-70 mt-0.5 sm:mt-1">Data pengurus, program, kegiatan, dan galeri</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="text-center bg-white/10 rounded-lg p-2 sm:p-3">
              <p className="text-xl sm:text-2xl font-bold">{stats.pengurus}</p>
              <p className="text-[10px] sm:text-xs opacity-70">Pengurus</p>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2 sm:p-3">
              <p className="text-xl sm:text-2xl font-bold">{stats.program}</p>
              <p className="text-[10px] sm:text-xs opacity-70">Program</p>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2 sm:p-3">
              <p className="text-xl sm:text-2xl font-bold">{stats.kegiatan}</p>
              <p className="text-[10px] sm:text-xs opacity-70">Kegiatan</p>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2 sm:p-3">
              <p className="text-xl sm:text-2xl font-bold">{stats.galeri}</p>
              <p className="text-[10px] sm:text-xs opacity-70">Galeri</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========== STATS GRID ========== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8"
      >
        {statCards.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Link
                to={stat.path}
                className="block bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-2.5 sm:p-3 rounded-full group-hover:scale-110 transition`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm text-green-500">
                  <TrendingUp size={14} />
                  <span>{stat.change} dari bulan lalu</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ========== RECENT ACTIVITY & QUICK ACTIONS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Activity size={18} className="text-pmi" /> Aktivitas Terbaru
          </h2>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">Belum ada aktivitas</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentActivities.map((activity, idx) => {
                const IconComp = activity.icon || Clock;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col xs:flex-row items-start xs:items-center justify-between py-2 sm:py-3 border-b dark:border-gray-700 last:border-0 group gap-1 xs:gap-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full xs:w-auto">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-pmi/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pmi transition">
                        <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pmi group-hover:text-white transition" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {activity.action}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Oleh {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap ml-0 xs:ml-4">
                      {getRelativeTime(activity.time)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Zap size={18} className="text-pmi" /> Aksi Cepat
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={() => handleQuickAction('/admin/struktur')}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-pmi/10 text-pmi p-3 sm:p-4 rounded-xl hover:bg-pmi hover:text-white transition-all duration-300 group text-xs sm:text-sm"
            >
              <Plus size={16} className="group-hover:rotate-90 transition" />
              <span className="font-medium">Tambah Pengurus</span>
            </button>
            <button
              onClick={() => handleQuickAction('/admin/program')}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-blue-500/10 text-blue-500 p-3 sm:p-4 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 group text-xs sm:text-sm"
            >
              <Plus size={16} className="group-hover:rotate-90 transition" />
              <span className="font-medium">Tambah Program</span>
            </button>
            <button
              onClick={() => handleQuickAction('/admin/kegiatan')}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-yellow-500/10 text-yellow-500 p-3 sm:p-4 rounded-xl hover:bg-yellow-500 hover:text-white transition-all duration-300 group text-xs sm:text-sm"
            >
              <Plus size={16} className="group-hover:rotate-90 transition" />
              <span className="font-medium">Tambah Kegiatan</span>
            </button>
            <button
              onClick={() => handleQuickAction('/admin/galeri')}
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-purple-500/10 text-purple-500 p-3 sm:p-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 group text-xs sm:text-sm"
            >
              <Plus size={16} className="group-hover:rotate-90 transition" />
              <span className="font-medium">Upload Galeri</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ========== NOTIFICATIONS ========== */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 space-y-2 z-50 max-w-[calc(100vw-24px)] sm:max-w-sm w-full">
            {notifications.map((notif, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 sm:p-4 border-l-4 border-pmi"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs sm:text-sm font-medium">{notif.message}</p>
                  <button
                    onClick={() => setNotifications(prev => prev.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{getRelativeTime(notif.time)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ========== LOGOUT MODAL ========== */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <LogOut size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Konfirmasi Logout</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6">
                  Apakah Anda yakin ingin keluar dari panel admin?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;