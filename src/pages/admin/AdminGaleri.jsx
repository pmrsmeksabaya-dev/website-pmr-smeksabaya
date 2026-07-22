import { useState, useEffect } from 'react';
import { 
  Upload, Trash2, Image as LucideImage, Video, X, Loader2, Plus, 
  FolderOpen, Check, AlertCircle, ChevronLeft, Grid, List, Edit, Save, 
  FileText, Eye, Pencil, PenSquare, Search, Filter, Download,
  ChevronRight, ChevronUp, ChevronDown, Copy, ExternalLink
} from 'lucide-react';
import { supabase } from '../../supabase/client';

const AdminGaleri = () => {
  const [albums, setAlbums] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [judul, setJudul] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [uploadResults, setUploadResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [viewMode, setViewMode] = useState('albums');
  const [viewType, setViewType] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [gridCols, setGridCols] = useState(4);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ========== GRID COLUMN MAPPING ==========
  const getGridColsClass = () => {
    if (gridCols === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (gridCols === 3) return 'grid-cols-2 sm:grid-cols-3';
    if (gridCols === 4) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
    if (gridCols === 5) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
    return 'grid-cols-3';
  };

  // ========== EDIT MODAL ==========
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [editDescValue, setEditDescValue] = useState('');

  const MAX_FILES = 50;
  const IG_WIDTH = 1080;
  const IG_HEIGHT = 1350;

  // ========== FETCH DATA ==========
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('galeri-admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'album' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'galeri' }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: albumData, error: albumError } = await supabase
        .from('album')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (albumError) throw albumError;
      setAlbums(albumData || []);

      const { data: galeriData, error: galeriError } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (galeriError) throw galeriError;
      setGaleri(galeriData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== HELPERS ==========
  const getAlbumCount = (albumId) => {
    return galeri.filter(g => g.album_id === albumId).length;
  };

  const getAlbumCover = (albumId) => {
    const firstItem = galeri.find(g => g.album_id === albumId);
    return firstItem?.url || 'https://picsum.photos/seed/' + albumId + '/400/400';
  };

  const getAlbumPhotos = () => {
    if (!currentAlbum) return [];
    return galeri.filter(g => g.album_id === currentAlbum.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // ========== SORTING & FILTERING ==========
  const filteredAlbums = albums.filter(album =>
    album.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (album.deskripsi && album.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    if (sortBy === 'terbaru') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'terlama') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
    if (sortBy === 'jumlah') return getAlbumCount(b.id) - getAlbumCount(a.id);
    return 0;
  });

  // ========== RESIZE IMAGE ==========
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = IG_WIDTH;
          canvas.height = IG_HEIGHT;
          
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const ratio = Math.min(IG_WIDTH / img.width, IG_HEIGHT / img.height);
          const newWidth = img.width * ratio;
          const newHeight = img.height * ratio;
          const x = (IG_WIDTH - newWidth) / 2;
          const y = (IG_HEIGHT - newHeight) / 2;
          
          ctx.drawImage(img, x, y, newWidth, newHeight);
          
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(resizedFile);
          }, 'image/jpeg', 0.92);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ========== FILE HANDLING ==========
  const handleFiles = async (files) => {
    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    
    if (validFiles.length === 0) {
      alert('Hanya file gambar dan video yang diperbolehkan!');
      return;
    }

    if (selectedFiles.length + validFiles.length > MAX_FILES) {
      alert(`Maksimal upload ${MAX_FILES} file sekaligus!`);
      return;
    }

    const processedFiles = [];
    const processedPreviews = [];

    for (const file of validFiles) {
      if (file.type.startsWith('image/')) {
        try {
          const resized = await resizeImage(file);
          processedFiles.push(resized);
          const previewUrl = URL.createObjectURL(resized);
          processedPreviews.push({ url: previewUrl, name: file.name });
        } catch (error) {
          console.error('Error resizing:', error);
          processedFiles.push(file);
          const previewUrl = URL.createObjectURL(file);
          processedPreviews.push({ url: previewUrl, name: file.name });
        }
      } else {
        processedFiles.push(file);
        const previewUrl = URL.createObjectURL(file);
        processedPreviews.push({ url: previewUrl, name: file.name, isVideo: true });
      }
    }

    setSelectedFiles(prev => [...prev, ...processedFiles]);
    setPreviews(prev => [...prev, ...processedPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // ========== ALBUM CRUD ==========
  const handleCreateAlbum = async () => {
    if (!albumName.trim()) {
      alert('Nama album harus diisi!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('album')
        .insert([{
          nama: albumName.trim(),
          deskripsi: albumDesc.trim() || null,
        }])
        .select();

      if (error) throw error;

      alert('Album berhasil dibuat!');
      setAlbumName('');
      setAlbumDesc('');
      setIsAlbumModalOpen(false);
      
      if (data && data.length > 0) {
        setSelectedAlbumId(data[0].id);
      }
      
      fetchData();
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Gagal membuat album: ' + error.message);
    }
  };

  const handleOpenEditModal = (album) => {
    setEditingAlbum(album);
    setEditTitleValue(album.nama || '');
    setEditDescValue(album.deskripsi || '');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAlbum) return;
    if (!editTitleValue.trim()) {
      alert('Judul album harus diisi!');
      return;
    }

    try {
      const { error } = await supabase
        .from('album')
        .update({ 
          nama: editTitleValue.trim(),
          deskripsi: editDescValue.trim() || null,
        })
        .eq('id', editingAlbum.id);

      if (error) throw error;

      alert('Album berhasil diupdate!');
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error('Error updating album:', error);
      alert('Gagal update album: ' + error.message);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingAlbum(null);
    setEditTitleValue('');
    setEditDescValue('');
  };

  const handleDeleteAlbum = async (albumId) => {
    const count = getAlbumCount(albumId);
    if (count > 0) {
      if (!confirm(`Album ini memiliki ${count} foto. Yakin ingin menghapus semua?`)) return;
    } else {
      if (!confirm('Yakin ingin menghapus album kosong ini?')) return;
    }

    try {
      const photos = galeri.filter(g => g.album_id === albumId);
      for (const photo of photos) {
        await supabase.from('galeri').delete().eq('id', photo.id);
        if (photo.url) {
          const path = photo.url.split('/').slice(-2).join('/');
          await supabase.storage.from('galeri').remove([path]);
        }
      }

      const { error } = await supabase.from('album').delete().eq('id', albumId);
      if (error) throw error;

      alert('Album berhasil dihapus!');
      if (currentAlbum && currentAlbum.id === albumId) {
        setCurrentAlbum(null);
        setViewMode('albums');
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Gagal menghapus album');
    }
  };

  // ========== UPLOAD ==========
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Pilih file terlebih dahulu!');
      return;
    }
    if (!judul.trim()) {
      alert('Masukkan judul!');
      return;
    }
    if (!selectedAlbumId) {
      alert('Pilih album atau buat album baru!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadResults([]);
    setShowResults(false);

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const isVideo = file.type.startsWith('video/');
      
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        const filePath = `galeri/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('galeri')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('galeri')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('galeri')
          .insert([{
            judul: judul.trim() + (selectedFiles.length > 1 ? ` (${i + 1})` : ''),
            url: publicUrl,
            tipe: isVideo ? 'video' : 'foto',
            album_id: selectedAlbumId,
          }]);

        if (dbError) throw dbError;

        results.push({ name: file.name, status: 'success' });
        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);
        results.push({ name: file.name, status: 'failed', error: error.message });
        failCount++;
      }

      setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setUploadResults(results);
    setShowResults(true);

    alert(`Upload selesai! ${successCount} berhasil, ${failCount} gagal.`);

    setSelectedFiles([]);
    setPreviews([]);
    setJudul('');
    setIsModalOpen(false);
    fetchData();
    setUploading(false);
  };

  // ========== DELETE FOTO ==========
  const handleDelete = async (id, url) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;

    try {
      const { error: dbError } = await supabase
        .from('galeri')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;

      if (url) {
        const path = url.split('/').slice(-2).join('/');
        await supabase.storage.from('galeri').remove([path]);
      }

      alert('Foto berhasil dihapus!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus');
    }
  };

  // ========== BULK DELETE ==========
  const handleBulkDelete = async () => {
    if (selectedPhotos.length === 0) return;
    if (!confirm(`Hapus ${selectedPhotos.length} foto yang dipilih?`)) return;
    
    try {
      for (const id of selectedPhotos) {
        const photo = galeri.find(g => g.id === id);
        await supabase.from('galeri').delete().eq('id', id);
        if (photo?.url) {
          const path = photo.url.split('/').slice(-2).join('/');
          await supabase.storage.from('galeri').remove([path]);
        }
      }
      setSelectedPhotos([]);
      setSelectAll(false);
      fetchData();
      alert('Foto berhasil dihapus!');
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Gagal menghapus foto');
    }
  };

  // ========== LIGHTBOX ==========
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // ========== NAVIGASI ==========
  const openAlbum = (album) => {
    setCurrentAlbum(album);
    setViewMode('photos');
    setSelectedPhotos([]);
    setSelectAll(false);
  };

  const backToAlbums = () => {
    setCurrentAlbum(null);
    setViewMode('albums');
    setSelectedPhotos([]);
    setSelectAll(false);
  };

  // ========== STATISTIK ==========
  const stats = {
    totalAlbums: albums.length,
    totalMedia: galeri.length,
    totalPhotos: galeri.filter(g => g.tipe === 'foto').length,
    totalVideos: galeri.filter(g => g.tipe === 'video').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-pmi animate-spin" />
      </div>
    );
  }

  // ============================================
  // VIEW: ALBUMS
  // ============================================
  if (viewMode === 'albums') {
    return (
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">🖼️ Galeri</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setSelectedAlbumId('');
                setIsAlbumModalOpen(true);
              }}
              className="flex-1 sm:flex-none bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition text-sm sm:text-base"
            >
              <FolderOpen size={16} /> <span className="hidden xs:inline">Album Baru</span>
            </button>
            <button
              onClick={() => {
                if (albums.length === 0) {
                  alert('Buat album terlebih dahulu!');
                  setIsAlbumModalOpen(true);
                  return;
                }
                setSelectedAlbumId(albums[0].id);
                setIsModalOpen(true);
              }}
              className="flex-1 sm:flex-none bg-pmi text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition text-sm sm:text-base"
            >
              <Plus size={16} /> <span className="hidden xs:inline">Upload</span>
            </button>
          </div>
        </div>

        {/* ========== INFO ALBUM ========== */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <FolderOpen size={18} className="text-pmi" />
              <span>
                <strong>{albums.length}</strong> Album • <strong>{galeri.length}</strong> Foto/Video
              </span>
            </div>
            <span className="text-xs bg-pmi/10 px-2 py-0.5 rounded-full">
              Klik album untuk lihat isi
            </span>
          </div>
        </div>

        {/* ========== STATS ========== */}
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
            <p className="text-lg sm:text-2xl font-bold text-pmi">{stats.totalAlbums}</p>
            <p className="text-[10px] sm:text-sm text-gray-500">Total Album</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
            <p className="text-lg sm:text-2xl font-bold text-pmi">{stats.totalMedia}</p>
            <p className="text-[10px] sm:text-sm text-gray-500">Total Media</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
            <p className="text-lg sm:text-2xl font-bold text-pmi">{stats.totalPhotos}</p>
            <p className="text-[10px] sm:text-sm text-gray-500">Foto</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
            <p className="text-lg sm:text-2xl font-bold text-pmi">{stats.totalVideos}</p>
            <p className="text-[10px] sm:text-sm text-gray-500">Video</p>
          </div>
        </div>

        {/* ========== SEARCH & SORT ========== */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
              <option value="nama">Nama A-Z</option>
              <option value="jumlah">Jumlah Media</option>
            </select>
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden xs:inline">Kolom:</span>
              <div className="flex gap-0.5 sm:gap-1">
                {[2, 3, 4, 5].map(col => (
                  <button
                    key={col}
                    onClick={() => setGridCols(col)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-xs rounded-lg transition ${
                      gridCols === col 
                        ? 'bg-pmi text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== ALBUM GRID ========== */}
        {sortedAlbums.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {searchQuery ? 'Tidak Ada Album Yang Cocok' : 'Belum Ada Album'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Buat album baru untuk mulai mengelola galeri.'}
            </p>
            <button
              onClick={() => setIsAlbumModalOpen(true)}
              className="mt-4 bg-pmi text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              <Plus size={16} className="inline mr-2" /> Buat Album
            </button>
          </div>
        ) : (
          <div className={`grid ${getGridColsClass()} gap-2 sm:gap-3 md:gap-4`}>
            {sortedAlbums.map((album) => {
              const count = getAlbumCount(album.id);
              const cover = getAlbumCover(album.id);

              return (
                <div
                  key={album.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    onClick={() => openAlbum(album)}
                    className="relative aspect-square overflow-hidden cursor-pointer"
                  >
                    <img
                      src={cover}
                      alt={album.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-between p-2 sm:p-3">
                      <span className="text-white text-[10px] sm:text-xs font-medium">
                        {count} item
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus album "${album.nama}" dan ${count} fotonya?`)) {
                            handleDeleteAlbum(album.id);
                          }
                        }}
                        className="p-1 sm:p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition"
                        title="Hapus album"
                      >
                        <Trash2 size={12} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-semibold text-xs sm:text-sm truncate flex-1">{album.nama}</h3>
                      <button
                        onClick={() => handleOpenEditModal(album)}
                        className="p-1 text-gray-400 hover:text-pmi transition opacity-0 group-hover:opacity-100"
                        title="Edit album"
                      >
                        <PenSquare size={12} />
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                      {album.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                    <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                      <p className="text-[10px] sm:text-xs text-gray-400">{count} foto</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-400">{formatDate(album.created_at)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========== MODALS ========== */}
        {/* Edit Album Modal */}
        {editModalOpen && editingAlbum && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <PenSquare size={18} className="text-pmi" />
                  Edit Album
                </h2>
                <button onClick={handleCloseEditModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Judul Album *
                  </label>
                  <input
                    type="text"
                    value={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                    placeholder="Masukkan judul album..."
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Deskripsi
                  </label>
                  <textarea
                    value={editDescValue}
                    onChange={(e) => setEditDescValue(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900 resize-none"
                    placeholder="Tulis deskripsi album di sini..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCloseEditModal}
                    className="flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2 text-sm sm:text-base bg-pmi text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Album Modal */}
        {isAlbumModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">📁 Buat Album Baru</h2>
                <button onClick={() => setIsAlbumModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Album *</label>
                  <input
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className="w-full px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: Donor Darah 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <input
                    type="text"
                    value={albumDesc}
                    onChange={(e) => setAlbumDesc(e.target.value)}
                    className="w-full px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Deskripsi album..."
                  />
                </div>
                <button
                  onClick={handleCreateAlbum}
                  className="w-full bg-pmi text-white py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
                >
                  Buat Album
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isModalOpen && (
          <UploadModal
            albums={albums}
            selectedAlbumId={selectedAlbumId}
            setSelectedAlbumId={setSelectedAlbumId}
            judul={judul}
            setJudul={setJudul}
            selectedFiles={selectedFiles}
            previews={previews}
            uploading={uploading}
            uploadProgress={uploadProgress}
            isDragging={isDragging}
            MAX_FILES={MAX_FILES}
            handleFiles={handleFiles}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            removeFile={removeFile}
            handleUpload={handleUpload}
            setIsModalOpen={setIsModalOpen}
            setIsAlbumModalOpen={setIsAlbumModalOpen}
          />
        )}
      </div>
    );
  }

  // ============================================
  // VIEW: PHOTOS
  // ============================================
  if (viewMode === 'photos' && currentAlbum) {
    const photos = getAlbumPhotos();

    return (
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        {/* ========== HEADER ========== */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={backToAlbums}
            className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-pmi transition text-sm sm:text-base"
          >
            <ChevronLeft size={20} />
            <span className="font-medium hidden xs:inline">Kembali</span>
          </button>
          <h1 className="text-lg sm:text-2xl font-bold flex-1 truncate">{currentAlbum.nama}</h1>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setSelectedAlbumId(currentAlbum.id);
                setIsModalOpen(true);
              }}
              className="bg-pmi text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-red-700 transition text-xs sm:text-sm"
            >
              <Plus size={14} /> <span className="hidden xs:inline">Upload</span>
            </button>
            {selectedPhotos.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition text-xs sm:text-sm flex items-center gap-1"
              >
                <Trash2 size={14} /> <span className="hidden xs:inline">Hapus ({selectedPhotos.length})</span>
              </button>
            )}
            <button
              onClick={() => {
                if (confirm(`Hapus album "${currentAlbum.nama}" dan ${photos.length} fotonya?`)) {
                  handleDeleteAlbum(currentAlbum.id);
                }
              }}
              className="bg-red-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition text-xs sm:text-sm flex items-center gap-1"
            >
              <Trash2 size={14} /> <span className="hidden sm:inline">Hapus Album</span>
            </button>
          </div>
        </div>

        {/* ========== ALBUM INFO ========== */}
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <LucideImage size={16} className="text-pmi" />
            <span>
              <strong>{photos.length}</strong> foto/video
            </span>
            {currentAlbum.deskripsi && (
              <span className="text-gray-400 hidden sm:inline">• {currentAlbum.deskripsi}</span>
            )}
            <span className="text-[10px] sm:text-xs text-gray-400">• {formatDate(currentAlbum.created_at)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const allIds = photos.map(p => p.id);
                if (selectAll) {
                  setSelectedPhotos([]);
                  setSelectAll(false);
                } else {
                  setSelectedPhotos(allIds);
                  setSelectAll(true);
                }
              }}
              className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {selectAll ? 'Batal Pilih' : 'Pilih Semua'}
            </button>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <span className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 hidden xs:inline">Kolom:</span>
              <div className="flex gap-0.5">
                {[2, 3, 4, 5].map(col => (
                  <button
                    key={col}
                    onClick={() => setGridCols(col)}
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-[8px] sm:text-[10px] rounded transition ${
                      gridCols === col 
                        ? 'bg-pmi text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== PHOTOS GRID ========== */}
        {photos.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <LucideImage size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Album Kosong</h3>
            <p className="text-sm sm:text-base text-gray-500">Belum ada foto di album ini.</p>
            <button
              onClick={() => {
                setSelectedAlbumId(currentAlbum.id);
                setIsModalOpen(true);
              }}
              className="mt-4 bg-pmi text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              <Plus size={16} className="inline mr-2" /> Upload Foto
            </button>
          </div>
        ) : (
          <div className={`grid ${getGridColsClass()} gap-2 sm:gap-3`}>
            {photos.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition aspect-square"
              >
                {/* ===== CHECKBOX - LEBIH KELIATAN ===== */}
                <input
                  type="checkbox"
                  checked={selectedPhotos.includes(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedPhotos(prev =>
                      prev.includes(item.id)
                        ? prev.filter(id => id !== item.id)
                        : [...prev, item.id]
                    );
                  }}
                  className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10 w-4 h-4 sm:w-4 sm:h-4 
                    rounded border-2 border-white shadow-lg cursor-pointer
                    checked:bg-pmi checked:border-pmi 
                    opacity-100 sm:opacity-0 group-hover:opacity-100 transition"
                />
                
                {/* ===== MEDIA ===== */}
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {item.tipe === 'foto' ? (
                    <img
                      src={item.url}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  )}
                </div>
                
                {/* ===== OVERLAY - TOMBOL HAPUS PER FOTO ===== */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                  opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-between p-1.5 sm:p-2">
                  <p className="text-white text-[8px] sm:text-xs truncate flex-1">{item.judul}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus foto "${item.judul}"?`)) {
                        handleDelete(item.id, item.url);
                      }
                    }}
                    className="p-1 sm:p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition"
                    title="Hapus foto"
                  >
                    <Trash2 size={10} className="text-white" />
                  </button>
                </div>

                {/* ===== BADGE VIDEO ===== */}
                {item.tipe === 'video' && (
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 px-1 sm:px-2 py-0.5 bg-black/60 rounded text-white text-[8px] sm:text-[10px] flex items-center gap-0.5 sm:gap-1">
                    <Video size={10} /> Video
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========== LIGHTBOX ========== */}
        {lightboxOpen && photos.length > 0 && (
          <div 
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-2 sm:p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-2xl sm:text-3xl hover:scale-110 transition z-10"
            >
              ✕
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
              }}
              className="absolute left-1 sm:left-4 text-white text-2xl sm:text-4xl hover:scale-110 transition z-10 p-2"
            >
              ‹
            </button>
            <div 
              className="max-h-[90vh] max-w-[90vw] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {photos[lightboxIndex]?.tipe === 'foto' ? (
                <img 
                  src={photos[lightboxIndex]?.url} 
                  alt={photos[lightboxIndex]?.judul}
                  className="max-h-[80vh] sm:max-h-[85vh] max-w-[80vw] sm:max-w-[85vw] object-contain rounded-lg"
                />
              ) : (
                <video 
                  src={photos[lightboxIndex]?.url} 
                  controls
                  autoPlay
                  className="max-h-[80vh] sm:max-h-[85vh] max-w-[80vw] sm:max-w-[85vw] rounded-lg"
                />
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-1 sm:right-4 text-white text-2xl sm:text-4xl hover:scale-110 transition z-10 p-2"
            >
              ›
            </button>
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-[10px] sm:text-sm text-center px-2">
              {lightboxIndex + 1} / {photos.length} • {photos[lightboxIndex]?.judul || 'Tanpa Judul'}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isModalOpen && (
          <UploadModal
            albums={albums}
            selectedAlbumId={selectedAlbumId}
            setSelectedAlbumId={setSelectedAlbumId}
            judul={judul}
            setJudul={setJudul}
            selectedFiles={selectedFiles}
            previews={previews}
            uploading={uploading}
            uploadProgress={uploadProgress}
            isDragging={isDragging}
            MAX_FILES={MAX_FILES}
            handleFiles={handleFiles}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            removeFile={removeFile}
            handleUpload={handleUpload}
            setIsModalOpen={setIsModalOpen}
            setIsAlbumModalOpen={setIsAlbumModalOpen}
          />
        )}
      </div>
    );
  }

  return null;
};

// ============================================
// UPLOAD MODAL COMPONENT - RESPONSIVE
// ============================================
const UploadModal = ({
  albums,
  selectedAlbumId,
  setSelectedAlbumId,
  judul,
  setJudul,
  selectedFiles,
  previews,
  uploading,
  uploadProgress,
  isDragging,
  MAX_FILES,
  handleFiles,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  removeFile,
  handleUpload,
  setIsModalOpen,
  setIsAlbumModalOpen,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-5 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
          <div>
            <h2 className="text-base sm:text-xl font-bold">Upload Media</h2>
            <p className="text-[10px] sm:text-sm text-gray-500">Maksimal {MAX_FILES} file • Ukuran 1080×1350</p>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul *</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
              placeholder="Masukkan judul..."
            />
            {selectedFiles.length > 1 && (
              <p className="text-xs text-gray-400 mt-1">* Foto akan diberi nomor otomatis: {judul} (1), {judul} (2), dst</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Album</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              >
                <option value="">Pilih Album</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.nama}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsAlbumModalOpen(true);
                }}
                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm whitespace-nowrap"
              >
                + Baru
              </button>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition ${
              isDragging ? 'border-pmi bg-pmi/5' : 'border-gray-300 dark:border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleFiles(files);
              }}
              className="hidden"
              id="fileInput"
              multiple
            />
            <label htmlFor="fileInput" className="cursor-pointer block">
              <Upload size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Drag & drop file di sini, atau <span className="text-pmi font-semibold">klik untuk pilih</span>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Support: JPG, PNG, GIF, MP4 • Max {MAX_FILES} file</p>
            </label>
          </div>

          {previews.length > 0 && (
            <div>
              <div className="flex flex-wrap justify-between items-center mb-2 gap-1">
                <p className="text-xs sm:text-sm font-medium">{previews.length} file dipilih</p>
                <button
                  onClick={() => {
                    if (confirm('Hapus semua file yang dipilih?')) {
                      setSelectedFiles([]);
                      setPreviews([]);
                    }
                  }}
                  className="text-[10px] sm:text-xs text-red-500 hover:underline"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2 max-h-48 overflow-auto">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                    {preview.isVideo ? (
                      <video src={preview.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={10} className="text-white" />
                    </button>
                    <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[6px] sm:text-[8px] p-0.5 truncate">
                      {preview.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0 || !selectedAlbumId}
            className="w-full bg-pmi text-white py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {uploading ? `Uploading ${uploadProgress}%...` : `Upload ${selectedFiles.length} File`}
          </button>

          {!selectedAlbumId && selectedFiles.length > 0 && (
            <p className="text-sm text-red-500 text-center">⚠️ Pilih album terlebih dahulu!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGaleri;