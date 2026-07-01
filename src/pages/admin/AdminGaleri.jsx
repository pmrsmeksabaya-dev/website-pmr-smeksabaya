import { useState, useEffect } from 'react';
import { 
  Upload, Trash2, Image as LucideImage, Video, X, Loader2, Plus, 
  FolderOpen, Check, AlertCircle, ChevronLeft, Grid, List, Edit, Save, 
  FileText, Eye, Pencil 
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
  
  // ========== EDIT DESKRIPSI DENGAN MODAL ==========
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editDescValue, setEditDescValue] = useState('');

  const handleOpenEditModal = (album) => {
    setEditingAlbum(album);
    setEditDescValue(album.deskripsi || '');
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingAlbum(null);
    setEditDescValue('');
  };

  const handleSaveDescription = async () => {
    if (!editingAlbum) return;

    try {
      const { error } = await supabase
        .from('album')
        .update({ deskripsi: editDescValue })
        .eq('id', editingAlbum.id);

      if (error) throw error;

      alert('Deskripsi album berhasil diupdate!');
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Gagal update deskripsi: ' + error.message);
    }
  };

  const MAX_FILES = 50;
  const IG_WIDTH = 1080;
  const IG_HEIGHT = 1350;

  useEffect(() => {
    fetchData();
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
    } finally {
      setLoading(false);
    }
  };

  const getAlbumCount = (albumId) => {
    return galeri.filter(g => g.album_id === albumId).length;
  };

  const getAlbumCover = (albumId) => {
    const firstItem = galeri.find(g => g.album_id === albumId);
    return firstItem?.url || 'https://picsum.photos/400/400?random=' + albumId;
  };

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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

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

  const handleCreateAlbum = async () => {
    if (!albumName) {
      alert('Nama album harus diisi!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('album')
        .insert([{
          nama: albumName,
          deskripsi: albumDesc || null,
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

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Pilih file terlebih dahulu!');
      return;
    }
    if (!judul) {
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
            judul: judul + (selectedFiles.length > 1 ? ` (${i + 1})` : ''),
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

  const openAlbum = (album) => {
    setCurrentAlbum(album);
    setViewMode('photos');
  };

  const backToAlbums = () => {
    setCurrentAlbum(null);
    setViewMode('albums');
  };

  const getAlbumPhotos = () => {
    if (!currentAlbum) return [];
    return galeri.filter(g => g.album_id === currentAlbum.id);
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
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">🖼️ Galeri</h1>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setSelectedAlbumId('');
                setIsAlbumModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
            >
              <FolderOpen size={20} /> Album Baru
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
              className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
            >
              <Plus size={20} /> Upload
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <LucideImage size={18} className="text-pmi" />
            <span>
              <strong>{albums.length}</strong> Album • <strong>{galeri.length}</strong> Foto/Video
            </span>
            <span className="text-xs bg-pmi/10 px-2 py-0.5 rounded-full">
              Klik album untuk lihat isi
            </span>
          </div>
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Belum Ada Album</h3>
            <p className="text-gray-500">Buat album baru untuk mulai mengelola galeri.</p>
            <button
              onClick={() => setIsAlbumModalOpen(true)}
              className="mt-4 bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Plus size={18} className="inline mr-2" /> Buat Album
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => {
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-between p-3">
                      <span className="text-white text-xs font-medium">
                        {count} item
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAlbum(album.id);
                        }}
                        className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate flex-1">{album.nama}</h3>
                      <button
                        onClick={() => handleOpenEditModal(album)}
                        className="p-1 text-gray-400 hover:text-pmi transition opacity-0 group-hover:opacity-100"
                        title="Edit deskripsi"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {album.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{count} foto</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Buat Album */}
        {isAlbumModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📁 Buat Album Baru</h2>
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: Donor Darah 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <input
                    type="text"
                    value={albumDesc}
                    onChange={(e) => setAlbumDesc(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Deskripsi album..."
                  />
                </div>
                <button
                  onClick={handleCreateAlbum}
                  className="w-full bg-pmi text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Buat Album
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========== EDIT DESKRIPSI MODAL ========== */}
        {editModalOpen && editingAlbum && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Edit size={20} className="text-pmi" />
                  Edit Deskripsi Album
                </h2>
                <button 
                  onClick={handleCloseEditModal} 
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Album: <span className="font-semibold text-gray-700 dark:text-gray-300">{editingAlbum.nama}</span></p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Deskripsi
                  </label>
                  <textarea
                    value={editDescValue}
                    onChange={(e) => setEditDescValue(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                    placeholder="Tulis deskripsi album di sini..."
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {editDescValue.length} karakter
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCloseEditModal}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="flex-1 px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Upload */}
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
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={backToAlbums}
            className="flex items-center gap-2 text-gray-600 hover:text-pmi transition"
          >
            <ChevronLeft size={24} />
            <span className="font-medium">Kembali</span>
          </button>
          <h1 className="text-2xl font-bold flex-1">{currentAlbum.nama}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedAlbumId(currentAlbum.id);
                setIsModalOpen(true);
              }}
              className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition text-sm"
            >
              <Plus size={18} /> Upload
            </button>
            <button
              onClick={() => handleDeleteAlbum(currentAlbum.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <LucideImage size={18} className="text-pmi" />
            <span>
              <strong>{photos.length}</strong> foto/video
            </span>
            {currentAlbum.deskripsi && (
              <span className="text-gray-400">• {currentAlbum.deskripsi}</span>
            )}
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <LucideImage size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Album Kosong</h3>
            <p className="text-gray-500">Belum ada foto di album ini.</p>
            <button
              onClick={() => {
                setSelectedAlbumId(currentAlbum.id);
                setIsModalOpen(true);
              }}
              className="mt-4 bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <Plus size={18} className="inline mr-2" /> Upload Foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition aspect-square"
              >
                {item.tipe === 'foto' ? (
                  <img
                    src={item.url}
                    alt={item.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id, item.url)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{item.judul}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Upload */}
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
// UPLOAD MODAL COMPONENT
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Upload Media</h2>
            <p className="text-sm text-gray-500">Maksimal {MAX_FILES} file • Ukuran 1080×1350</p>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul *</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
              placeholder="Masukkan judul..."
            />
            {selectedFiles.length > 1 && (
              <p className="text-xs text-gray-400 mt-1">* Foto akan diberi nomor otomatis: {judul} (1), {judul} (2), dst</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Album</label>
            <div className="flex gap-2">
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm whitespace-nowrap"
              >
                + Baru
              </button>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
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
              <Upload size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Drag & drop file di sini, atau <span className="text-pmi font-semibold">klik untuk pilih</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Support: JPG, PNG, GIF, MP4 • Max {MAX_FILES} file</p>
            </label>
          </div>

          {previews.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">{previews.length} file dipilih</p>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-auto">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                    {preview.isVideo ? (
                      <video src={preview.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={preview.url} alt={preview.name} className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={12} className="text-white" />
                    </button>
                    <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] p-1 truncate">
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
            className="w-full bg-pmi text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
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