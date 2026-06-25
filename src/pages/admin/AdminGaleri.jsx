import { useState, useEffect } from 'react';
import { Upload, Trash2, Image as LucideImage, Video, X, Loader2, Plus, FolderOpen, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabase/client';

const defaultAlbums = [
  { id: 1, nama: 'Donor Darah PMI 2025', deskripsi: 'Kegiatan donor darah 2 Januari 2025', cover: 'https://picsum.photos/600/400?random=10' }
];

const AdminGaleri = () => {
  const [galeri, setGaleri] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [judul, setJudul] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [tipe, setTipe] = useState('foto');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [uploadResults, setUploadResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

      if (!albumData || albumData.length === 0) {
        const { error: insertError } = await supabase
          .from('album')
          .insert([{
            nama: defaultAlbums[0].nama,
            deskripsi: defaultAlbums[0].deskripsi,
            cover: defaultAlbums[0].cover,
          }]);
        
        if (!insertError) {
          const { data: newData } = await supabase
            .from('album')
            .select('*')
            .order('created_at', { ascending: false });
          setAlbums(newData || []);
        }
      } else {
        setAlbums(albumData);
      }

      const { data: galeriData, error: galeriError } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (galeriError) throw galeriError;
      setGaleri(galeriData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setAlbums(defaultAlbums);
      setGaleri([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Resize image ke ukuran IG (1080x1350) - PAKE window.Image
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image(); // 👈 FIX: pake window.Image
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
            album_id: albumId || null,
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
    setAlbumId('');
    setIsModalOpen(false);
    fetchData();
    setUploading(false);
  };

  const handleDelete = async (id, url) => {
    if (!confirm('Yakin ingin menghapus ini?')) return;

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

      alert('Berhasil dihapus!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus');
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
        <h1 className="text-2xl font-bold">🖼️ Kelola Galeri</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <FolderOpen size={20} /> Buat Album
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Plus size={20} /> Upload Media
          </button>
        </div>
      </div>

      {/* Informasi Ukuran */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <LucideImage size={18} className="text-pmi" />
          <span>Ukuran foto otomatis diresize ke <strong>1080×1350</strong> (Instagram portrait)</span>
          <span className="text-xs bg-pmi/10 px-2 py-0.5 rounded-full">Max 50 file</span>
        </div>
      </div>

      {/* Album List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {albums.map((album) => (
          <div key={album.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img src={album.cover || 'https://picsum.photos/100/100?random=1'} alt={album.nama} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold">{album.nama}</h4>
                <p className="text-xs text-gray-500">{album.deskripsi || 'Tidak ada deskripsi'}</p>
                <p className="text-xs text-gray-400">
                  {galeri.filter(g => g.album_id === album.id).length} item
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Galeri Grid */}
      {galeri.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <LucideImage size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Galeri Masih Kosong</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Belum ada foto atau video yang diupload.
            <br />
            <span className="text-sm text-pmi font-medium">Klik tombol "Upload Media" untuk menambahkan.</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galeri.map((item) => (
            <div key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              {item.tipe === 'foto' ? (
                <img src={item.url} alt={item.judul} className="w-full aspect-[4/5] object-cover" />
              ) : (
                <video src={item.url} className="w-full aspect-[4/5] object-cover" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDelete(item.id, item.url)}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  <Trash2 size={18} className="text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-medium truncate">{item.judul}</p>
                <p className="text-white/60 text-xs">{item.tipe}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Upload */}
      {isModalOpen && (
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
                <select
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                >
                  <option value="">Tanpa Album</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>{a.nama}</option>
                  ))}
                </select>
              </div>

              {/* Drag & Drop Area */}
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
                  onChange={handleFileSelect}
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

              {/* Preview List */}
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

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pmi h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Results */}
              {showResults && uploadResults.length > 0 && (
                <div className="max-h-32 overflow-auto border rounded-lg p-2 text-sm">
                  {uploadResults.map((result, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-0.5">
                      {result.status === 'success' ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <AlertCircle size={14} className="text-red-500" />
                      )}
                      <span className="truncate">{result.name}</span>
                      <span className={`text-xs ${result.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {result.status === 'success' ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="w-full bg-pmi text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
              >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                {uploading ? `Uploading ${uploadProgress}%...` : `Upload ${selectedFiles.length} File`}
              </button>
            </div>
          </div>
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
    </div>
  );
};

export default AdminGaleri;