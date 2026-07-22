import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, User, Search, Filter, ArrowRight, Heart, 
  Droplet, Loader2, Share2, ChevronLeft, ChevronRight,
  Clock, Eye
} from 'lucide-react';
import { supabase } from '../supabase/client';

// ============= SKELETON =============
const KegiatanSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="w-full h-56 bg-gray-300 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
    </div>
  </div>
);

const KegiatanPage = () => {
  const [kegiatan, setKegiatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ========== FETCH DATA ==========
  const fetchKegiatan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .select('*')
        .order('tanggal', { ascending: false });
      
      if (error) throw error;
      setKegiatan(data || []);
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
      setKegiatan([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== REALTIME ==========
  useEffect(() => {
    fetchKegiatan();

    const channel = supabase
      .channel('kegiatan-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kegiatan' },
        () => {
          console.log('📢 Kegiatan berubah, refresh data...');
          fetchKegiatan();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ========== RESET PAGE SAAT FILTER BERUBAH ==========
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  // ========== AMBIL KATEGORI UNIK ==========
  const categories = ['Semua', ...new Set(kegiatan.map(k => k.kategori).filter(Boolean))];

  // ========== FILTER ==========
  const filtered = kegiatan.filter(k => {
    const matchSearch = k.judul.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || k.kategori === category;
    return matchSearch && matchCategory;
  });

  // ========== PAGINATION ==========
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ========== KEGIATAN TERBARU ==========
  const getLatestKegiatan = () => {
    if (kegiatan.length === 0) return null;
    const sorted = [...kegiatan].sort((a, b) => {
      if (!a.tanggal) return 1;
      if (!b.tanggal) return -1;
      return new Date(b.tanggal) - new Date(a.tanggal);
    });
    return sorted[0] || null;
  };

  const latestKegiatan = getLatestKegiatan();

  // ========== FORMAT TANGGAL ==========
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // ========== HIGHLIGHT TITLE ==========
  const highlightTitle = (title) => {
    if (title.includes("Donor Darah")) {
      return (
        <span className="flex items-center gap-2">
          <Droplet className="text-red-500" size={18} />
          {title}
        </span>
      );
    }
    return title;
  };

  // ========== SHARE ==========
  const shareKegiatan = (judul) => {
    if (navigator.share) {
      navigator.share({
        title: judul,
        text: `Lihat kegiatan PMR Wira: ${judul}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kegiatan disalin!');
    }
  };

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
            Kegiatan & <span className="text-pmi">Berita</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Informasi kegiatan terbaru PMR Wira SMKN 1 Pringgabaya
          </p>
        </motion.div>

        {/* Filter & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari kegiatan..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi transition" 
            />
          </div>
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none transition"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Badge Kegiatan Terbaru */}
        {latestKegiatan && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-3 rounded-full animate-pulse">
                <Heart className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  🔥 Terbaru
                  <span className="text-xs font-normal bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                    {formatDate(latestKegiatan.tanggal)}
                  </span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {latestKegiatan.judul}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {latestKegiatan.kategori || 'Kegiatan'} • {latestKegiatan.penulis || 'Admin'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedKegiatan(latestKegiatan)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                Lihat Detail
              </button>
            </div>
          </motion.div>
        )}

        {/* Kegiatan Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {search || category !== 'Semua' ? (
                <Search size={48} className="text-gray-400" />
              ) : (
                <Calendar size={48} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {search || category !== 'Semua' ? 'Tidak Ada Kegiatan Yang Cocok' : 'Belum Ada Kegiatan'}
            </h3>
            <p className="text-gray-500">
              {search || category !== 'Semua' 
                ? 'Coba ubah filter atau kata kunci pencarian' 
                : 'Admin belum menambahkan kegiatan terbaru.'}
            </p>
            {(search || category !== 'Semua') && (
              <button 
                onClick={() => { setSearch(''); setCategory('Semua'); }}
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
                {currentItems.map((item, idx) => {
                  const isLatest = latestKegiatan && item.id === latestKegiatan.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedKegiatan(item)}
                      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                        isLatest ? 'border-2 border-red-400 dark:border-red-600' : 'border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.thumbnail || `https://picsum.photos/seed/${item.id}/600/400`} 
                          alt={item.judul} 
                          className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            e.target.src = `https://picsum.photos/seed/${item.id}/600/400`;
                          }}
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className="px-3 py-1 bg-pmi text-white text-xs font-medium rounded-full">
                            {item.kategori || 'Umum'}
                          </span>
                        </div>
                        {isLatest && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 animate-pulse">
                              🔥 Terbaru
                            </span>
                          </div>
                        )}
                        {item.judul.includes("Donor Darah") && !isLatest && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                              <Droplet size={12} /> Donor Darah
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> 
                            {formatDate(item.tanggal)}
                          </span>
                          {item.penulis && (
                            <span className="flex items-center gap-1">
                              <User size={14} /> {item.penulis}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-pmi transition line-clamp-2">
                          {highlightTitle(item.judul)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.konten}
                        </p>
                        <button className="mt-4 text-pmi font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">
                          Baca Selengkapnya <ArrowRight size={16} />
                        </button>
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

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedKegiatan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedKegiatan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedKegiatan.thumbnail || `https://picsum.photos/seed/${selectedKegiatan.id}/600/400`} 
                  alt={selectedKegiatan.judul} 
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${selectedKegiatan.id}/600/400`;
                  }}
                />
                <button 
                  onClick={() => setSelectedKegiatan(null)} 
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
                >
                  ✕
                </button>
                {selectedKegiatan.id === latestKegiatan?.id && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    🔥 Terbaru
                  </div>
                )}
                {selectedKegiatan.judul.includes("Donor Darah") && selectedKegiatan.id !== latestKegiatan?.id && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Droplet size={14} /> Donor Darah
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedKegiatan.judul}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> 
                    {formatDate(selectedKegiatan.tanggal)}
                  </span>
                  {selectedKegiatan.penulis && (
                    <span className="flex items-center gap-1">
                      <User size={14} /> {selectedKegiatan.penulis}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-pmi/10 text-pmi rounded-full text-xs font-medium">
                    {selectedKegiatan.kategori || 'Umum'}
                  </span>
                  {selectedKegiatan.judul.includes("Donor Darah") && (
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium flex items-center gap-1">
                      <Droplet size={12} /> Donor Darah
                    </span>
                  )}
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedKegiatan.konten}
                  </p>
                </div>
                <button 
                  onClick={() => shareKegiatan(selectedKegiatan.judul)}
                  className="mt-4 text-pmi font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm"
                >
                  <Share2 size={16} /> Bagikan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KegiatanPage;