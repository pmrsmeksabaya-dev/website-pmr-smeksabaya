import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, Loader2, Droplet, Calendar, User, Image, RefreshCw } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedGaleri, setSelectedGaleri] = useState(null);
  const [showGaleriPicker, setShowGaleriPicker] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    tanggal: '',
    penulis: '',
    konten: '',
    thumbnail: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch kegiatan
      const { data: kegiatanData, error: kegiatanError } = await supabase
        .from('kegiatan')
        .select('*')
        .order('tanggal', { ascending: false });
      
      if (kegiatanError) throw kegiatanError;

      // Fetch galeri untuk pilihan thumbnail
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
    } finally {
      setLoading(false);
    }
  };

  // Ambil foto dari galeri untuk thumbnail
  const getThumbnailFromGaleri = (judul) => {
    // Cari foto dari galeri yang judulnya mirip dengan kegiatan
    const keyword = judul.toLowerCase().replace('donor darah', 'donor').replace('pmr', '');
    const matched = galeri.find(g => 
      g.judul.toLowerCase().includes(keyword) || 
      keyword.includes(g.judul.toLowerCase().split(' ')[0])
    );
    return matched?.url || 'https://picsum.photos/600/400?random=1';
  };

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

  const handleSave = async () => {
    if (!formData.judul || !formData.konten) {
      alert('Judul dan konten harus diisi!');
      return;
    }

    // Jika thumbnail kosong, cari otomatis dari galeri
    let thumbnailUrl = formData.thumbnail;
    if (!thumbnailUrl) {
      const autoThumbnail = getThumbnailFromGaleri(formData.judul);
      if (autoThumbnail) {
        thumbnailUrl = autoThumbnail;
      }
    }

    setSaving(true);
    try {
      const dataToSave = {
        judul: formData.judul,
        kategori: formData.kategori,
        tanggal: formData.tanggal,
        penulis: formData.penulis,
        konten: formData.konten,
        thumbnail: thumbnailUrl,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('kegiatan')
          .update(dataToSave)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        alert('Kegiatan berhasil diupdate!');
      } else {
        const { error } = await supabase
          .from('kegiatan')
          .insert([dataToSave]);
        
        if (error) throw error;
        alert('Kegiatan berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan data: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;

    try {
      const { error } = await supabase.from('kegiatan').delete().eq('id', id);
      if (error) throw error;
      alert('Kegiatan berhasil dihapus!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus: ' + error.message);
    }
  };

  const filtered = kegiatan.filter(item =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  // Refresh thumbnail semua kegiatan dengan foto dari galeri
  const refreshAllThumbnails = async () => {
    if (!confirm('Refresh semua thumbnail dengan foto dari galeri?')) return;
    
    setSaving(true);
    try {
      for (const item of kegiatan) {
        const newThumbnail = getThumbnailFromGaleri(item.judul);
        if (newThumbnail && newThumbnail !== item.thumbnail) {
          const { error } = await supabase
            .from('kegiatan')
            .update({ thumbnail: newThumbnail })
            .eq('id', item.id);
          if (error) throw error;
        }
      }
      alert('Semua thumbnail berhasil di-refresh!');
      fetchData();
    } catch (error) {
      console.error('Error refreshing thumbnails:', error);
      alert('Gagal refresh thumbnail');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-pmi animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">📋 Kelola Kegiatan</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={refreshAllThumbnails}
            disabled={saving}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={saving ? 'animate-spin' : ''} />
            Refresh Thumbnail
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Plus size={20} /> Tambah Kegiatan
          </button>
        </div>
      </div>

      {/* Info Galeri & Thumbnail */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Image size={18} className="text-blue-500" />
          <span>
            Thumbnail otomatis diambil dari <strong>Galeri</strong> ({galeri.length} foto tersedia)
          </span>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
            Ukuran: 600×400 px
          </span>
        </div>
      </div>

      {/* Info Donor Darah */}
      {kegiatan.length > 0 && kegiatan.some(k => k.judul.includes('Donor Darah')) && (
        <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-full">
              <Droplet className="text-white" size={16} />
            </div>
            <div>
              <p className="font-semibold text-red-600 dark:text-red-400 text-sm">
                ✅ Donor Darah PMI - 2 Januari 2025
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Kegiatan default, jangan dihapus!</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-gray-50 dark:bg-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Thumbnail</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.judul} 
                        className="w-16 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://picsum.photos/600/400?random=1';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image size={20} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium line-clamp-1 flex items-center gap-1">
                        {item.judul.includes('Donor Darah') && <Droplet size={14} className="text-red-500" />}
                        {item.judul}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
                      {item.kategori || 'Umum'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className={`p-1 ${item.judul.includes('Donor Darah') ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                      disabled={item.judul.includes('Donor Darah')}
                      title={item.judul.includes('Donor Darah') ? 'Kegiatan default tidak bisa dihapus' : ''}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada kegiatan yang ditemukan
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500 flex justify-between">
          <span>Total {filtered.length} dari {kegiatan.length} kegiatan</span>
          <span>Galeri: {galeri.length} foto</span>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul *</label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Masukkan judul kegiatan..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Thumbnail akan otomatis diambil dari galeri berdasarkan judul
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Sosial, Pelatihan, dll"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Penulis</label>
                <input
                  type="text"
                  value={formData.penulis}
                  onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Nama penulis..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Thumbnail (Opsional - kosongkan untuk auto dari galeri)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="https://example.com/gambar.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const autoThumb = getThumbnailFromGaleri(formData.judul);
                      if (autoThumb) {
                        setFormData({ ...formData, thumbnail: autoThumb });
                        alert('Thumbnail otomatis diambil dari galeri!');
                      } else {
                        alert('Tidak ada foto di galeri yang cocok dengan judul ini.');
                      }
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-1"
                  >
                    <RefreshCw size={14} /> Auto
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  🔄 Kosongkan untuk auto-pilih dari galeri berdasarkan judul
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Konten *</label>
                <textarea
                  value={formData.konten}
                  onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Tulis deskripsi kegiatan di sini..."
                />
              </div>
            </div>

            <div className="p-5 border-t dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKegiatan;