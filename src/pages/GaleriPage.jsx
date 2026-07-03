import { useState, useEffect } from 'react';
import { X, Camera, Video, LayoutGrid, Image, Clock, Loader2, ChevronRight, Download, Eye } from 'lucide-react';
import { supabase } from '../supabase/client';

const GaleriPage = () => {
  const [albums, setAlbums] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [view, setView] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);

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
    return firstItem?.url || 'https://picsum.photos/600/400?random=1';
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // ========== DOWNLOAD FUNCTION ==========
  const handleDownload = async (url, filename) => {
    try {
      // Fetch file dari URL
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Buat link download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Gagal mendownload file. Silakan coba lagi.');
    }
  };

  const getFilename = (url, index) => {
    const extension = url.split('.').pop() || 'jpg';
    return `PMR_${selectedAlbum?.nama?.replace(/\s/g, '_') || 'galeri'}_${index + 1}.${extension}`;
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Galeri <span className="text-pmi">Kegiatan</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Dokumentasi kegiatan PMR Wira SMKN 1 Pringgabaya</p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setView('grid')} 
              className={`p-2 rounded ${view === 'grid' ? 'bg-pmi text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500">{albums.length} Album • {galeri.length} Item</p>
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Image size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Belum Ada Album</h3>
            <p className="text-gray-500">Admin belum menambahkan galeri foto/video.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => {
              const count = getAlbumCount(album.id);
              const cover = getAlbumCover(album.id);
              
              return (
                <div 
                  key={album.id} 
                  onClick={() => setSelectedAlbum(album)} 
                  className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={cover} 
                      alt={album.nama} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg truncate">
                        {album.nama}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white/80 text-sm truncate flex-1">
                          {album.deskripsi ? truncateText(album.deskripsi, 35) : `${count} item`}
                        </p>
                        {album.deskripsi && album.deskripsi.length > 35 && (
                          <span className="text-pmi text-xs font-medium flex items-center gap-0.5 whitespace-nowrap">
                            Lihat Selengkapnya <ChevronRight size={14} />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-white/60 text-xs">
                        <span className="flex items-center gap-1">
                          <Camera size={12} />
                          {count} item
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail Album */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAlbum(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedAlbum.nama}</h3>
                {selectedAlbum.deskripsi && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAlbum.deskripsi}</p>
                )}
              </div>
              <button onClick={() => setSelectedAlbum(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {galeri.filter(g => g.album_id === selectedAlbum.id).map((item, index) => (
                <div key={item.id} className="group relative rounded-lg overflow-hidden bg-gray-100">
                  {item.tipe === 'foto' ? (
                    <img 
                      src={item.url} 
                      alt={item.judul} 
                      className="w-full aspect-[4/5] object-cover cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                    />
                  ) : (
                    <video 
                      src={item.url} 
                      className="w-full aspect-[4/5] object-cover cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                    />
                  )}
                  {/* Download Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const filename = getFilename(item.url, index);
                      handleDownload(item.url, filename);
                    }}
                    className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-pmi rounded-full transition opacity-0 group-hover:opacity-100"
                    title="Download"
                  >
                    <Download size={16} className="text-white" />
                  </button>
                  {item.judul && (
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1 truncate px-1">
                      {item.judul}
                    </p>
                  )}
                </div>
              ))}
              {galeri.filter(g => g.album_id === selectedAlbum.id).length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Camera size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500">Belum ada foto/video di album ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Media */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition z-10"
            >
              <X size={24} />
            </button>
            <button
              onClick={() => {
                const filename = `PMR_${selectedAlbum?.nama?.replace(/\s/g, '_') || 'galeri'}.${selectedMedia.url.split('.').pop() || 'jpg'}`;
                handleDownload(selectedMedia.url, filename);
              }}
              className="absolute bottom-4 right-4 p-3 bg-pmi hover:bg-red-700 rounded-full text-white transition z-10 flex items-center gap-2"
            >
              <Download size={20} /> Download
            </button>
            {selectedMedia.tipe === 'foto' ? (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.judul} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : (
              <video 
                src={selectedMedia.url} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                controls
                autoPlay
              />
            )}
            {selectedMedia.judul && (
              <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-lg">
                {selectedMedia.judul}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriPage;