import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, X, Save, Loader2, Droplet, 
  Calendar, User, Image, RefreshCw, AlertCircle, CheckCircle,
  Filter, ChevronDown, Eye, ExternalLink, Clock, Info
} from 'lucide-react';
import { supabase } from '../../supabase/client';

const defaultKegiatan = {
  id: 1,
  judul: "Donor Darah PMI - SMKN 1 Pringgabaya",
  kategori: "Sosial",
  tanggal: "2025-01-02",
  penulis: "Divisi Humas",
  konten: "Kegiatan donor darah bekerja sama dengan PMI Kabupaten Lombok Timur. Acara ini diikuti oleh siswa, guru, dan masyarakat sekitar. Terkumpul 50 kantong darah yang akan disalurkan ke PMI untuk membantu sesama.",
  thumbnail: "https://picsum.photos/600/400?random=1"
};

const AdminKegiatan = () => {
  const [kegiatan, setKegiatan] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    tanggal: '',
    penulis: '',
    konten: '',
    thumbnail: '',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ========== DEBOUNCE SEARCH ==========
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: kegiatanData, error: kegiatanError } = await supabase
        .from('kegiatan')
        .select('*')
        .order('tanggal', { ascending: false });
      
      if (kegiatanError) throw kegiatanError;

      const { data: galeriData, error: galeriError } = await supabase
        .from('galeri')
        .select('*')
        .eq('tipe', 'foto')
        .order('created_at', { ascending: false });

      if (galeriError) throw galeriError;
      setGaleri(galeriData || []);

      if (!kegiatanData || kegiatanData.length === 0) {
        const { error: insertError } = await supabase
          .from('kegiatan')
          .insert([{
            judul: defaultKegiatan.judul,
            kategori: defaultKegiatan.kategori,
            tanggal: defaultKegiatan.tanggal,
            penulis: defaultKegiatan.penulis,
            konten: defaultKegiatan.konten,
            thumbnail: defaultKegiatan.thumbnail,
          }]);
        
        if (insertError) throw insertError;
        
        const { data: newData, error: fetchError } = await supabase
          .from('kegiatan')
          .select('*')
          .order('tanggal', { ascending: false });
        
        if (fetchError) throw fetchError;
        setKegiatan(newData || []);
      } else {
        setKegiatan(kegiatanData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setKegiatan([defaultKegiatan]);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========== REALTIME SUBSCRIPTION ==========
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('kegiatan-admin-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'kegiatan' 
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ========== TOAST ==========
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ========== GET THUMBNAIL DARI GALERI BERDASARKAN KEGIATAN_ID ==========
  const getThumbnailFromGaleri = async (kegiatanId) => {
    if (!kegiatanId) return 'https://picsum.photos/600/400?random=1';

    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('url')
        .eq('kegiatan_id', kegiatanId)
        .eq('tipe', 'foto')
        .order('created_at', { ascending: true })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.url || 'https://picsum.photos/600/400?random=1';
    } catch (error) {
      console.error('Error getting thumbnail:', error);
      return 'https://picsum.photos/600/400?random=1';
    }
  };

  // ========== GET THUMBNAIL DARI GALERI - SUPER CERDAS ==========
const getThumbnailFromGaleriByKeyword = (judulKegiatan) => {
  if (!judulKegiatan || galeri.length === 0) {
    return 'https://picsum.photos/600/400?random=1';
  }

  // 1. Ekstrak keyword dari judul kegiatan
  const cleanJudul = judulKegiatan
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
  
  const keywords = cleanJudul.split(' ').filter(w => w.length > 2);
  
  // 2. Keyword prioritas (spesifik)
  const priorityMap = {
    'falcon': ['falcon', 'serah', 'terima', 'jabatan'],
    'obat': ['obat', 'ttd', 'pembagian', 'kesehatan'],
    'donor': ['donor', 'darah', 'pmi', 'pmr'],
    'pelantikan': ['pelantikan', 'serah', 'terima'],
    'uks': ['uks', 'kesehatan', 'sekolah'],
    'p3k': ['p3k', 'pertolongan', 'pertama']
  };

  // 3. Cari foto dengan skor tertinggi
  let bestMatch = null;
  let bestScore = 0;

  for (const foto of galeri) {
    if (!foto.judul) continue;
    
    const fotoJudul = foto.judul.toLowerCase();
    let score = 0;

    // Keyword match (2 poin per keyword)
    for (const keyword of keywords) {
      if (fotoJudul.includes(keyword)) {
        score += 2;
      }
    }

    // Priority keyword match (15 poin)
    for (const [key, words] of Object.entries(priorityMap)) {
      if (cleanJudul.includes(key)) {
        for (const word of words) {
          if (fotoJudul.includes(word)) {
            score += 15;
          }
        }
      }
    }

    // Bonus: jika judul foto mengandung kata yang sama persis
    for (const word of keywords) {
      if (word.length > 3 && fotoJudul.includes(word)) {
        score += 3;
      }
    }

    // Bonus: jika judul foto mengandung "obat" dan kegiatan "obat"
    if (cleanJudul.includes('obat') && fotoJudul.includes('obat')) {
      score += 20;
    }
    if (cleanJudul.includes('falcon') && fotoJudul.includes('falcon')) {
      score += 20;
    }
    if (cleanJudul.includes('donor') && fotoJudul.includes('donor')) {
      score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = foto;
    }
  }

  // 4. Jika ada yang cocok (score > 0)
  if (bestMatch && bestScore > 0) {
    console.log(`✅ Found thumbnail for "${judulKegiatan}": ${bestMatch.judul} (score: ${bestScore})`);
    return bestMatch.url;
  }

  // 5. Fallback: cari berdasarkan kata kunci pertama yang panjang
  if (keywords.length > 0) {
    const longKeywords = keywords.filter(w => w.length > 3);
    for (const kw of longKeywords) {
      const fallback = galeri.find(f => f.judul?.toLowerCase().includes(kw));
      if (fallback) {
        console.log(`⚠️ Fallback found for "${judulKegiatan}": ${fallback.judul}`);
        return fallback.url;
      }
    }
  }

  // 6. Fallback: foto pertama dari galeri
  console.log(`❌ No match for "${judulKegiatan}", using first photo`);
  return galeri[0]?.url || 'https://picsum.photos/600/400?random=1';
};

  // ========== REFRESH THUMBNAIL SATU KEGIATAN ==========
  const refreshSingleThumbnail = async (item) => {
    // Coba ambil dari kegiatan_id dulu
    let newThumbnail = await getThumbnailFromGaleri(item.id);
    
    // Jika tidak ada, coba pake keyword
    if (newThumbnail === 'https://picsum.photos/600/400?random=1') {
      newThumbnail = getThumbnailFromGaleriByKeyword(item.judul);
    }

    if (newThumbnail && newThumbnail !== item.thumbnail) {
      try {
        const { error } = await supabase
          .from('kegiatan')
          .update({ thumbnail: newThumbnail })
          .eq('id', item.id);
        if (error) throw error;
        showToast(`Thumbnail "${item.judul}" berhasil di-refresh!`, 'success');
        fetchData();
      } catch (error) {
        console.error('Error refreshing thumbnail:', error);
        showToast('Gagal refresh thumbnail', 'error');
      }
    } else {
      showToast(`Thumbnail "${item.judul}" sudah sesuai`, 'info');
    }
  };

  // ========== REFRESH ALL THUMBNAILS ==========
  const refreshAllThumbnails = async () => {
    if (!confirm('Refresh semua thumbnail dengan foto dari galeri?')) return;
    
    setSaving(true);
    let updated = 0;
    try {
      for (const item of kegiatan) {
        // Coba dari kegiatan_id dulu
        let newThumbnail = await getThumbnailFromGaleri(item.id);
        
        // Jika tidak ada, coba pake keyword
        if (newThumbnail === 'https://picsum.photos/600/400?random=1') {
          newThumbnail = getThumbnailFromGaleriByKeyword(item.judul);
        }

        if (newThumbnail && newThumbnail !== item.thumbnail) {
          const { error } = await supabase
            .from('kegiatan')
            .update({ thumbnail: newThumbnail })
            .eq('id', item.id);
          if (error) throw error;
          updated++;
        }
      }
      showToast(`${updated} thumbnail berhasil di-refresh!`, 'success');
      fetchData();
    } catch (error) {
      console.error('Error refreshing thumbnails:', error);
      showToast('Gagal refresh thumbnail', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ========== MODAL ==========
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        judul: item.judul,
        kategori: item.kategori || '',
        tanggal: item.tanggal || '',
        penulis: item.penulis || '',
        konten: item.konten || '',
        thumbnail: item.thumbnail || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        judul: '',
        kategori: '',
        tanggal: '',
        penulis: '',
        konten: '',
        thumbnail: '',
      });
    }
    setIsModalOpen(true);
  };

  // ========== SAVE ==========
  const handleSave = async () => {
    if (!formData.judul || !formData.konten) {
      showToast('Judul dan konten harus diisi!', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        judul: formData.judul,
        kategori: formData.kategori,
        tanggal: formData.tanggal,
        penulis: formData.penulis,
        konten: formData.konten,
        thumbnail: formData.thumbnail || 'https://picsum.photos/600/400?random=1',
      };

      let kegiatanId;
      if (editingItem) {
        const { error } = await supabase
          .from('kegiatan')
          .update(dataToSave)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        kegiatanId = editingItem.id;
        showToast('Kegiatan berhasil diupdate!', 'success');
      } else {
        const { data, error } = await supabase
          .from('kegiatan')
          .insert([dataToSave])
          .select();
        
        if (error) throw error;
        kegiatanId = data?.[0]?.id;
        showToast('Kegiatan berhasil ditambahkan!', 'success');
      }

      // Auto-assign thumbnail dari galeri berdasarkan kegiatan_id
      if (kegiatanId) {
        const thumbnailFromGaleri = await getThumbnailFromGaleri(kegiatanId);
        if (thumbnailFromGaleri !== 'https://picsum.photos/600/400?random=1') {
          await supabase
            .from('kegiatan')
            .update({ thumbnail: thumbnailFromGaleri })
            .eq('id', kegiatanId);
        } else {
          // Fallback keyword
          const fallbackThumb = getThumbnailFromGaleriByKeyword(formData.judul);
          if (fallbackThumb) {
            await supabase
              .from('kegiatan')
              .update({ thumbnail: fallbackThumb })
              .eq('id', kegiatanId);
          }
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Gagal menyimpan data: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ========== DELETE ==========
  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const { error } = await supabase.from('kegiatan').delete().eq('id', deleteConfirm);
      if (error) throw error;
      showToast('Kegiatan berhasil dihapus!', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Gagal menghapus: ' + error.message, 'error');
    }
  };

  // ========== FILTER & SEARCH ==========
  const uniqueKategori = ['Semua', ...new Set(kegiatan.map(k => k.kategori).filter(Boolean))];

  const filtered = kegiatan.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  // ========== SKELETON ==========
  if (loading) {
    return (
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      {/* ========== TOAST ========== */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm w-full ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={20} />
            ) : (
              <Info size={20} />
            )}
            <span className="text-sm flex-1">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: 'success' })}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== HEADER ========== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">📋 Kelola Kegiatan</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {kegiatan.length} kegiatan tersedia
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={refreshAllThumbnails}
            disabled={saving}
            className="flex-1 sm:flex-none bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={16} className={saving ? 'animate-spin' : ''} />
            <span className="hidden xs:inline">Refresh All</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-none bg-pmi text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition text-sm sm:text-base"
          >
            <Plus size={16} /> <span className="hidden xs:inline">Tambah</span>
          </button>
        </div>
      </motion.div>

      {/* ========== INFO GALERI ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <Image size={16} className="text-blue-500" />
          <span>
            Thumbnail otomatis diambil dari <strong>Galeri</strong> ({galeri.length} foto tersedia)
          </span>
          <span className="text-[10px] sm:text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
            Ukuran: 600×400 px
          </span>
        </div>
      </motion.div>

      {/* ========== SEARCH & FILTER ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mb-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari kegiatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900 appearance-none"
            >
              {uniqueKategori.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* ========== TABLE ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">No</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Thumbnail</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Judul</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase hidden sm:table-cell">Kategori</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase hidden md:table-cell">Tanggal</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((item, idx) => (
                <motion.tr 
                  key={item.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{idx + 1}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.judul} 
                        className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.src = 'https://picsum.photos/600/400?random=1';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image size={14} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div>
                      <p className="font-medium text-xs sm:text-sm line-clamp-1 flex items-center gap-1">
                        {item.judul.includes('Donor Darah') && <Droplet size={12} className="text-red-500" />}
                        {item.judul.includes('FALCON') && <span className="text-yellow-500">⭐</span>}
                        {item.judul}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-[10px] sm:text-xs">
                      {item.kategori || 'Umum'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2">
                      <button 
                        onClick={() => handleOpenModal(item)} 
                        className="p-1 text-blue-500 hover:text-blue-700 transition"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => refreshSingleThumbnail(item)} 
                        className="p-1 text-green-500 hover:text-green-700 transition"
                        title="Refresh Thumbnail"
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className={`p-1 transition ${
                          item.judul.includes('Donor Darah') 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-500 hover:text-red-700'
                        }`}
                        disabled={item.judul.includes('Donor Darah')}
                        title={item.judul.includes('Donor Darah') ? 'Kegiatan default tidak bisa dihapus' : 'Hapus'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="flex justify-center mb-4">
              <Search size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {search || filterKategori !== 'Semua' 
                ? 'Tidak ada kegiatan yang cocok dengan filter' 
                : 'Belum ada kegiatan. Tambahkan kegiatan baru!'}
            </p>
          </div>
        ) : (
          <div className="p-3 sm:p-4 border-t dark:border-gray-700 text-[10px] sm:text-sm text-gray-500 flex flex-wrap justify-between gap-2">
            <span>Menampilkan {filtered.length} dari {kegiatan.length} kegiatan</span>
            <span>Galeri: {galeri.length} foto</span>
          </div>
        )}
      </motion.div>

      {/* ========== MODAL ========== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-5 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold">
                  {editingItem ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul *</label>
                  <input
                    type="text"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                    placeholder="Masukkan judul kegiatan..."
                  />
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    💡 Thumbnail akan otomatis diambil dari galeri berdasarkan judul
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <input
                      type="text"
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                      placeholder="Sosial, Pelatihan, dll"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Penulis</label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                    placeholder="Nama penulis..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL Thumbnail (Opsional)</label>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                      placeholder="https://example.com/gambar.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const autoThumb = getThumbnailFromGaleriByKeyword(formData.judul);
                        if (autoThumb) {
                          setFormData({ ...formData, thumbnail: autoThumb });
                          showToast('Thumbnail otomatis diambil dari galeri!', 'success');
                        } else {
                          showToast('Tidak ada foto di galeri yang cocok dengan judul ini.', 'error');
                        }
                      }}
                      className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center justify-center gap-1 whitespace-nowrap"
                    >
                      <RefreshCw size={14} /> Auto
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    🔄 Kosongkan untuk auto-pilih dari galeri berdasarkan judul
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Konten *</label>
                  <textarea
                    value={formData.konten}
                    onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900 resize-none"
                    placeholder="Tulis deskripsi kegiatan di sini..."
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t dark:border-gray-700 flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== DELETE CONFIRM MODAL ========== */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Hapus Kegiatan?</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Hapus
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

export default AdminKegiatan;