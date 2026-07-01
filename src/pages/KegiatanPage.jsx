import { useState, useEffect } from 'react';
import { Calendar, User, Search, Filter, ArrowRight, Heart, Droplet, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';

const KegiatanPage = () => {
  const [kegiatan, setKegiatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  useEffect(() => {
    fetchKegiatan();

    // ========== REALTIME SUBSCRIPTION ==========
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

  // Ambil kategori unik
  const categories = ['Semua', ...new Set(kegiatan.map(k => k.kategori).filter(Boolean))];

  const filtered = kegiatan.filter(k => {
    const matchSearch = k.judul.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || k.kategori === category;
    return matchSearch && matchCategory;
  });

  // ========== CEK APAKAH KEGIATAN TERBARU ==========
  // Kegiatan terbaru adalah yang memiliki tanggal paling baru
  const getLatestKegiatan = () => {
    if (kegiatan.length === 0) return null;
    // Urutkan berdasarkan tanggal (desc) dan ambil yang pertama
    const sorted = [...kegiatan].sort((a, b) => {
      if (!a.tanggal) return 1;
      if (!b.tanggal) return -1;
      return new Date(b.tanggal) - new Date(a.tanggal);
    });
    return sorted[0] || null;
  };

  const latestKegiatan = getLatestKegiatan();

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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Kegiatan & <span className="text-pmi">Berita</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Informasi kegiatan terbaru PMR Wira SMKN 1 Pringgabaya</p>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari kegiatan..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi" 
            />
          </div>
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Badge Kegiatan Terbaru - REALTIME */}
        {latestKegiatan && (
          <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-3 rounded-full animate-pulse">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  🔥 Terbaru
                  <span className="text-xs font-normal bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                    {new Date(latestKegiatan.tanggal).toLocaleDateString('id-ID')}
                  </span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {latestKegiatan.judul}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {latestKegiatan.kategori || 'Kegiatan'} • {latestKegiatan.penulis || 'Admin'}
                </p>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Belum Ada Kegiatan</h3>
            <p className="text-gray-500">Admin belum menambahkan kegiatan terbaru.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              // Cek apakah ini kegiatan terbaru
              const isLatest = latestKegiatan && item.id === latestKegiatan.id;
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedKegiatan(item)}
                  className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                    isLatest ? 'border-2 border-red-400 dark:border-red-600' : ''
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.thumbnail || 'https://picsum.photos/600/400?random=1'} 
                      alt={item.judul} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/600/400?random=1';
                      }}
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
                        {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                      </span>
                      {item.penulis && (
                        <span className="flex items-center gap-1"><User size={14} /> {item.penulis}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-pmi transition">
                      {highlightTitle(item.judul)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{item.konten}</p>
                    <button className="mt-4 text-pmi font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">
                      Baca Selengkapnya <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedKegiatan && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedKegiatan(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={selectedKegiatan.thumbnail || 'https://picsum.photos/600/400?random=1'} 
                alt={selectedKegiatan.judul} 
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/600/400?random=1';
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
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> 
                  {selectedKegiatan.tanggal ? new Date(selectedKegiatan.tanggal).toLocaleDateString('id-ID') : '-'}
                </span>
                {selectedKegiatan.penulis && (
                  <span className="flex items-center gap-1"><User size={14} /> {selectedKegiatan.penulis}</span>
                )}
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {selectedKegiatan.kategori || 'Umum'}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {selectedKegiatan.konten}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanPage;