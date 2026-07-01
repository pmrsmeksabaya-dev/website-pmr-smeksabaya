import { useState, useEffect } from 'react';
import { X, Camera, Video, LayoutGrid, Image, Clock, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase/client';

const GaleriPage = () => {
  const [albums, setAlbums] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [view, setView] = useState('grid');

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
                  {/* Gambar - Full width, teks di overlay bawah */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={cover} 
                      alt={album.nama} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    
                    {/* Overlay gradient dari bawah */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                      {/* Nama Album - 1 baris dengan truncate */}
                      <h3 className="text-white font-bold text-lg truncate">
                        {album.nama}
                      </h3>
                      
                      {/* Deskripsi - 1 baris dengan truncate + Lihat Selengkapnya */}
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
                      
                      {/* Item count */}
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
              {galeri.filter(g => g.album_id === selectedAlbum.id).map((item) => (
                <div key={item.id} className="rounded-lg overflow-hidden">
                  {item.tipe === 'foto' ? (
                    <img src={item.url} alt={item.judul} className="w-full aspect-[4/5] object-cover" />
                  ) : (
                    <video src={item.url} className="w-full aspect-[4/5] object-cover" controls />
                  )}
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
    </div>
  );
};

export default GaleriPage;