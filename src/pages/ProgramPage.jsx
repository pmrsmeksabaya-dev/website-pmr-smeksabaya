import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Circle, Filter, Search, Target, Award, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';

const statusColors = { 
  Rencana: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", 
  Berjalan: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", 
  Selesai: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", 
  Rahasia: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
};

const statusIcons = { 
  Rencana: Circle, 
  Berjalan: Clock, 
  Selesai: CheckCircle, 
  Rahasia: Award 
};

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('Semua');
  const [divisions, setDivisions] = useState(['Semua']);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [stats, setStats] = useState({ total: 0, rencana: 0, berjalan: 0, selesai: 0, rahasia: 0 });

  // ========== FETCH DATA ==========
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const programsData = data || [];
      setPrograms(programsData);

      // Update statistik
      const statsData = {
        total: programsData.length,
        rencana: programsData.filter(p => p.status === 'Rencana').length,
        berjalan: programsData.filter(p => p.status === 'Berjalan').length,
        selesai: programsData.filter(p => p.status === 'Selesai').length,
        rahasia: programsData.filter(p => p.status === 'Rahasia').length,
      };
      setStats(statsData);

      // Ambil divisi unik
      const uniqueDivisions = [...new Set(programsData.map(p => p.divisi).filter(Boolean))];
      setDivisions(['Semua', ...uniqueDivisions]);

    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== REALTIME SUBSCRIPTION ==========
  useEffect(() => {
    fetchPrograms();

    const channel = supabase
      .channel('program-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_kerja' },
        () => {
          console.log('📢 Program Kerja berubah, refresh data...');
          fetchPrograms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = programs.filter(prog => {
    const matchSearch = prog.judul.toLowerCase().includes(search.toLowerCase());
    const matchDivision = division === 'Semua' || prog.divisi === division;
    return matchSearch && matchDivision;
  });

  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-pmi animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Program <span className="text-pmi">Kerja</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            PMR Wira SMKN 1 Pringgabaya memiliki <span className="font-bold text-pmi">{stats.total} Program Kerja</span> unggulan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-pmi">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Proker</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-green-500">{stats.berjalan}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sedang Berjalan</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-yellow-500">{stats.rencana}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rencana</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-blue-500">{stats.selesai}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Telah Selesai</p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari program kerja..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi" 
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={division} 
              onChange={e => setDivision(e.target.value)} 
              className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              {divisions.map(div => <option key={div} value={div}>{div}</option>)}
            </select>
          </div>
        </div>

        {/* Program Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Belum Ada Program</h3>
            <p className="text-gray-500">Admin belum menambahkan program kerja.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(prog => {
              const StatusIcon = statusIcons[prog.status] || Circle;
              return (
                <div 
                  key={prog.id} 
                  onClick={() => setSelectedProgram(prog)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-pmi/50"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold group-hover:text-pmi transition line-clamp-2">{prog.judul}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ml-2 ${statusColors[prog.status]}`}>
                        <StatusIcon size={12} /> {prog.status}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center gap-1">
                      <span className="font-medium text-pmi">Divisi:</span> {prog.divisi || '-'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar size={14} />
                      <span>{prog.tanggal_mulai ? new Date(prog.tanggal_mulai).toLocaleDateString('id-ID') : 'Flexible'}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {prog.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail Program */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProgram(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-pmi">{selectedProgram.judul}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Divisi: {selectedProgram.divisi || '-'}</p>
              </div>
              <button onClick={() => setSelectedProgram(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b dark:border-gray-700">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusColors[selectedProgram.status]}`}>
                  {(() => {
                    const IconComponent = statusIcons[selectedProgram.status];
                    return IconComponent ? <IconComponent size={14} /> : null;
                  })()}
                  <span>{selectedProgram.status}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>{selectedProgram.tanggal_mulai ? new Date(selectedProgram.tanggal_mulai).toLocaleDateString('id-ID') : 'Jadwal fleksibel'}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Target className="text-pmi" size={20} /> Deskripsi Program
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedProgram.deskripsi || 'Tidak ada deskripsi'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramPage;