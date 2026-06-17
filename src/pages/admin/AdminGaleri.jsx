import { useState, useEffect } from 'react';
import { Upload, Trash2, Image, Video, X, Loader2, Plus } from 'lucide-react';
import { supabase } from '../../supabase/client';

const AdminGaleri = () => {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState('foto');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setGaleri(data || []);
    } catch (error) {
      console.error('Error fetching galeri:', error);
      alert('Gagal memuat data galeri');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Pilih file terlebih dahulu!');
      return;
    }
    if (!judul) {
      alert('Masukkan judul!');
      return;
    }

    setUploading(true);
    try {
      // Upload ke Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `galeri/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('galeri')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('galeri')
        .getPublicUrl(filePath);

      // Simpan ke database
      const { error: dbError } = await supabase
        .from('galeri')
        .insert([{
          judul: judul,
          url: publicUrl,
          tipe: tipe,
        }]);

      if (dbError) throw dbError;

      alert('Upload berhasil!');
      setSelectedFile(null);
      setPreview(null);
      setJudul('');
      setIsModalOpen(false);
      fetchGaleri();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, url) => {
    if (!confirm('Yakin ingin menghapus ini?')) return;

    try {
      // Hapus dari database
      const { error: dbError } = await supabase
        .from('galeri')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;

      // Hapus dari storage
      if (url) {
        const path = url.split('/').slice(-2).join('/');
        await supabase.storage.from('galeri').remove([path]);
      }

      alert('Berhasil dihapus!');
      fetchGaleri();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Galeri</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus size={20} /> Upload Media
        </button>
      </div>

      {/* Grid Galeri */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galeri.map((item) => (
          <div key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {item.tipe === 'foto' ? (
              <img src={item.url} alt={item.judul} className="w-full h-48 object-cover" />
            ) : (
              <video src={item.url} className="w-full h-48 object-cover" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button
                onClick={() => handleDelete(item.id, item.url)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
              >
                <Trash2 size={18} className="text-white" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{item.judul}</p>
              <p className="text-xs text-gray-500">{item.tipe}</p>
            </div>
          </div>
        ))}
      </div>

      {galeri.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Image size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Belum ada galeri. Upload foto/video sekarang!</p>
        </div>
      )}

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Media</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Masukkan judul..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipe</label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi"
                >
                  <option value="foto">Foto</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input
                  type="file"
                  accept={tipe === 'foto' ? 'image/*' : 'video/*'}
                  onChange={handleFileSelect}
                  className="w-full"
                />
                {preview && (
                  <div className="mt-2">
                    {tipe === 'foto' ? (
                      <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    ) : (
                      <video src={preview} className="w-full h-40 object-cover rounded-lg" controls />
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-pmi text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGaleri;