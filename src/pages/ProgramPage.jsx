import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle, Circle, Filter, Search, 
  Target, Award, Loader2, ChevronLeft, ChevronRight, 
  AlertCircle, TrendingUp 
} from 'lucide-react';
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

const statusOrder = { Rencana: 1, Berjalan: 2, Selesai: 3, Rahasia: 4 };

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');
  const [divisions, setDivisions] = useState(['Semua']);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, rencana: 0, berjalan: 0, selesai: 0, rahasia: 0 });
  
  const itemsPerPage = 6;

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

      const statsData = {
        total: programsData.length,
        rencana: programsData.filter(p => p.status === 'Rencana').length,
        berjalan: programsData.filter(p => p.status === 'Berjalan').length,
        selesai: programsData.filter(p => p.status === 'Selesai').length,
        rahasia: programsData.filter(p => p.status === 'Rahasia').length,
      };
      setStats(statsData);

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

  // ========== FILTER, SORT, PAGINATE ==========
  const filtered = programs.filter(prog => {
    const matchSearch = prog.judul.toLowerCase().includes(search.toLowerCase());
    const matchDivision = division === 'Semua' || prog.divisi === division;
    return matchSearch && matchDivision;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'terbaru') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'terlama') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'judul') return a.judul.localeCompare(b.judul);
    if (sortBy === 'status') return statusOrder[a.status] - statusOrder[b.status];
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const currentItems = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, division, sortBy]);

  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-pmi" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Program <span className="text-pmi">Kerja</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
            PMR Wira SMKN 1 Pringgabaya memiliki <span className="font-bold text-pmi">{stats.total} Program Kerja</span> unggulan
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Proker', value: stats.total, color: 'text-pmi', icon: Target },
            { label: 'Sedang Berjalan', value: stats.berjalan, color: 'text-green-500', icon: TrendingUp },
            { label: 'Rencana', value: stats.rencana, color: 'text-yellow-500', icon: Circle },
            { label: 'Telah Selesai', value: stats.selesai, color: 'text-blue-500', icon: CheckCircle },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari program kerja..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi transition" 
            />
          </div>
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={division} 
              onChange={e => setDivision(e.target.value)} 
              className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none transition"
            >
              {divisions.map(div => <option key={div} value={div}>{div}</option>)}
            </select>
          </div>
          <div className="relative md:w-40">
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)} 
              className="w-full pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none transition"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="judul">A-Z</option>
              <option value="status">Status</option>
            </select>
          </div>
        </motion.div>

        {/* Program Cards Grid */}
        {currentItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {search || division !== 'Semua' ? (
                <Search size={48} className="text-gray-400" />
              ) : (
                <Calendar size={48} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {search || division !== 'Semua' ? 'Tidak Ada Program Yang Cocok' : 'Belum Ada Program'}
            </h3>
            <p className="text-gray-500">
              {search || division !== 'Semua' 
                ? 'Coba ubah filter atau kata kunci pencarian' 
                : 'Admin belum menambahkan program kerja.'}
            </p>
            {(search || division !== 'Semua') && (
              <button 
                onClick={() => { setSearch(''); setDivision('Semua'); setSortBy('terbaru'); }}
                className="mt-4 text-pmi hover:underline font-medium"
              >
                Reset Filter
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {currentItems.map((prog, idx) => {
                  const StatusIcon = statusIcons[prog.status] || Circle;
                  return (
                    <motion.div
                      key={prog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedProgram(prog)}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-pmi/50"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="text-lg font-bold group-hover:text-pmi transition line-clamp-2">
                            {prog.judul}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ${statusColors[prog.status]}`}>
                            <StatusIcon size={12} /> {prog.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-pmi/10 text-pmi rounded-full text-xs font-medium">
                            {prog.divisi || 'Umum'}
                          </span>
                          {prog.status === 'Rahasia' && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium flex items-center gap-1">
                              <Award size={12} /> 🔒 Rahasia
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar size={14} />
                          <span>
                            {prog.tanggal_mulai 
                              ? new Date(prog.tanggal_mulai).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Jadwal fleksibel'}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                          {prog.deskripsi || 'Tidak ada deskripsi'}
                        </p>

                        {prog.status === 'Berjalan' && prog.progress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{prog.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${prog.progress || 0}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="bg-gradient-to-r from-green-400 to-green-500 rounded-full h-2"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-8"
              >
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === pageNum 
                          ? 'bg-pmi text-white' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal Detail Program */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-start rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-bold text-pmi">{selectedProgram.judul}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Divisi: {selectedProgram.divisi || '-'}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedProgram(null)} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-3 pb-3 border-b dark:border-gray-700">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusColors[selectedProgram.status]}`}>
                    {(() => {
                      const IconComponent = statusIcons[selectedProgram.status];
                      return IconComponent ? <IconComponent size={14} /> : null;
                    })()}
                    <span>{selectedProgram.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>
                      {selectedProgram.tanggal_mulai 
                        ? new Date(selectedProgram.tanggal_mulai).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Jadwal fleksibel'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Target className="text-pmi" size={20} /> Deskripsi Program
                  </h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedProgram.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                  </div>
                </div>

                {selectedProgram.status === 'Berjalan' && selectedProgram.progress && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <TrendingUp className="text-green-500" size={20} /> Progress
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-500 rounded-full h-3 transition-all duration-1000"
                        style={{ width: `${selectedProgram.progress}%` }}
                      />
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">{selectedProgram.progress}%</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramPage;