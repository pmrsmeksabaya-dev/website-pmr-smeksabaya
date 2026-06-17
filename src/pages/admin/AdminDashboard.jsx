import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, FileText, Image, TrendingUp, Activity, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pengurus: 0,
    program: 0,
    berita: 0,
    galeri: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch all data realtime
  useEffect(() => {
    fetchAllData();

    // Subscribe ke perubahan database
    const subscription = supabase
      .channel('admin-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pengurus' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_kerja' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'berita' },
        () => fetchAllData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'galeri' },
        () => fetchAllData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch semua data paralel
      const [pengurusRes, programRes, beritaRes, galeriRes] = await Promise.all([
        supabase.from('pengurus').select('*', { count: 'exact', head: true }),
        supabase.from('program_kerja').select('*', { count: 'exact', head: true }),
        supabase.from('berita').select('*', { count: 'exact', head: true }),
        supabase.from('galeri').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        pengurus: pengurusRes.count || 0,
        program: programRes.count || 0,
        berita: beritaRes.count || 0,
        galeri: galeriRes.count || 0,
      });

      // Fetch recent activities
      const { data: recentData } = await supabase
        .from('pengurus')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      const activities = [
        { action: 'Menambah pengurus baru', time: 'Baru saja', user: 'Admin' },
        { action: 'Mengupdate program kerja', time: '5 jam lalu', user: 'Admin' },
        { action: 'Menambah galeri foto', time: '1 hari lalu', user: 'Admin' },
      ];
      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  // Stat cards data
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
      title: 'Berita', 
      value: stats.berita, 
      icon: FileText, 
      color: 'bg-yellow-500',
      path: '/admin/berita',
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
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          <button
            onClick={fetchAllData}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid - Clickable */}
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
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-pmi" /> Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oleh {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
            )}
          </div>
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
              onClick={() => handleQuickAction('/admin/berita')}
              className="flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-500 p-4 rounded-xl hover:bg-yellow-500 hover:text-white transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition" />
              Tambah Berita
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