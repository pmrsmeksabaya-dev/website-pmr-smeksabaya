import { Users, Calendar, Image, FileText, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Pengurus', value: 15, icon: Users, color: 'bg-blue-500' },
    { title: 'Program Kerja', value: 12, icon: Calendar, color: 'bg-green-500' },
    { title: 'Berita', value: 8, icon: FileText, color: 'bg-yellow-500' },
    { title: 'Galeri', value: 45, icon: Image, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { action: 'Menambah pengurus baru', time: '2 jam lalu', user: 'Admin' },
    { action: 'Mengupdate program kerja', time: '5 jam lalu', user: 'Admin' },
    { action: 'Menambah galeri foto', time: '1 hari lalu', user: 'Admin' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-green-500">
              <TrendingUp size={16} />
              <span>+12% dari bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} /> Aktivitas Terbaru
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oleh {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-pmi/10 text-pmi p-3 rounded-lg hover:bg-pmi hover:text-white transition">
              + Tambah Pengurus
            </button>
            <button className="bg-pmi/10 text-pmi p-3 rounded-lg hover:bg-pmi hover:text-white transition">
              + Tambah Program
            </button>
            <button className="bg-pmi/10 text-pmi p-3 rounded-lg hover:bg-pmi hover:text-white transition">
              + Tambah Berita
            </button>
            <button className="bg-pmi/10 text-pmi p-3 rounded-lg hover:bg-pmi hover:text-white transition">
              + Upload Galeri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;