import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Image, TrendingUp, Activity, Plus, LogOut, RefreshCw } from 'lucide-react';
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
  const { logout } = useAuth();
  const navigate = useNavigate();

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

      // Fetch recent activities dari semua tabel
      const activities = [];

      // Ambil 1 aktivitas terbaru dari pengurus
      const { data: pengurusRecent } = await supabase
        .from('pengurus')
        .select('nama, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (pengurusRecent && pengurusRecent.length > 0) {
        activities.push({
          action: `Menambah pengurus: ${pengurusRecent[0].nama}`,
          time: new Date(pengurusRecent[0].created_at),
          user: 'Admin'
        });
      }

      // Ambil 1 aktivitas terbaru dari program
      const { data: programRecent } = await supabase
        .from('program_kerja')
        .select('judul, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (programRecent && programRecent.length > 0) {
        activities.push({
          action: `Menambah program: ${programRecent[0].judul}`,
          time: new Date(programRecent[0].created_at),
          user: 'Admin'
        });
      }

      // Ambil 1 aktivitas terbaru dari kegiatan
      const { data: kegiatanRecent } = await supabase
        .from('kegiatan')
        .select('judul, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (kegiatanRecent && kegiatanRecent.length > 0) {
        activities.push({
          action: `Menambah kegiatan: ${kegiatanRecent[0].judul}`,
          time: new Date(kegiatanRecent[0].created_at),
          user: 'Admin'
        });
      }

      // Ambil 1 aktivitas terbaru dari galeri
      const { data: galeriRecent } = await supabase
        .from('galeri')
        .select('judul, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (galeriRecent && galeriRecent.length > 0) {
        activities.push({
          action: `Menambah galeri: ${galeriRecent[0].judul}`,
          time: new Date(galeriRecent[0].created_at),
          user: 'Admin'
        });
      }

      // Urutkan berdasarkan waktu terbaru dan ambil 3
      activities.sort((a, b) => b.time - a.time);
      setRecentActivities(activities.slice(0, 3));

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== REALTIME SUBSCRIPTION ==========
  useEffect(() => {
    // Fetch data pertama kali
    fetchAllData();

    // Subscribe ke semua tabel yang relevan
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pengurus' },
        () => {
          console.log('📢 Pengurus berubah, refresh data...');
          fetchAllData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_kerja' },
        () => {
          console.log('📢 Program Kerja berubah, refresh data...');
          fetchAllData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kegiatan' },
        () => {
          console.log('📢 Kegiatan berubah, refresh data...');
          fetchAllData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'galeri' },
        () => {
          console.log('📢 Galeri berubah, refresh data...');
          fetchAllData();
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
      });

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

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

  // Format waktu relatif
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pmi mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchAllData}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-1"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.path}
              className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full group-hover:scale-110 transition`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp size={16} />
                <span>{stat.change} dari bulan lalu</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity - REALTIME */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-pmi" /> Aktivitas Terbaru
          </h2>
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Oleh {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {getRelativeTime(activity.time)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">⚡ Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAction('/admin/struktur')}
              className="flex items-center justify-center gap-2 bg-pmi/10 text-pmi p-4 rounded-xl hover:bg-pmi hover:text-white transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition" />
              Tambah Pengurus
            </button>
            <button
              onClick={() => handleQuickAction('/admin/program')}
              className="flex items-center justify-center gap-2 bg-blue-500/10 text-blue-500 p-4 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition" />
              Tambah Program
            </button>
            <button
              onClick={() => handleQuickAction('/admin/kegiatan')}
              className="flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-500 p-4 rounded-xl hover:bg-yellow-500 hover:text-white transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition" />
              Tambah Kegiatan
            </button>
            <button
              onClick={() => handleQuickAction('/admin/galeri')}
              className="flex items-center justify-center gap-2 bg-purple-500/10 text-purple-500 p-4 rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition" />
              Upload Galeri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;