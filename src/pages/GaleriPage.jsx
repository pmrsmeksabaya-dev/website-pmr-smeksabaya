import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, Video, LayoutGrid, Image, Clock, Loader2, 
  ChevronRight, Download, Eye, ChevronLeft, ZoomIn, ZoomOut
} from 'lucide-react';
import { supabase } from '../supabase/client';

// ============= SKELETON =============
const AlbumSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="aspect-[4/3] bg-gray-300 dark:bg-gray-700" />
    <div className="p-4 space-y-2">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const GaleriPage = () => {
  const [albums, setAlbums] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [view, setView] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const [albumRes, galeriRes] = await Promise.all([
        supabase.from('album').select('*').order('created_at', { ascending: false }),
        supabase.from('galeri').select('*').order('created_at', { ascending: false })
      ]);
      
      if (albumRes.error) throw albumRes.error;
      if (galeriRes.error) throw galeriRes.error;
      
      setAlbums(albumRes.data || []);
      setGaleri(galeriRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== REALTIME ==========
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('galeri-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'galeri'
      }, () => fetchData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'album'
      }, () => fetchData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ========== HELPERS ==========
  const getAlbumCount = (albumId) => {
    return galeri.filter(g => g.album_id === albumId).length;
  };

  const getAlbumCover = (albumId) => {
    const firstItem = galeri.find(g => g.album_id === albumId);
    return firstItem?.url || 'https://picsum.photos/seed/' + albumId + '/600/400';
  };

  const getAlbumMedia = (albumId) => {
    return galeri.filter(g => g.album_id === albumId);
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getFilename = (url, index) => {
    const extension = url.split('.').pop()?.split('?')[0] || 'jpg';
    return `PMR_${selectedAlbum?.nama?.replace(/\s/g, '_') || 'galeri'}_${index + 1}.${extension}`;
  };

  // ========== DOWNLOAD ==========
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
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

  // ========== NAVIGASI PREVIEW ==========
  const albumMedia = selectedAlbum ? getAlbumMedia(selectedAlbum.id) : [];
  
  const goToPrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : albumMedia.length - 1));
    setSelectedMedia(albumMedia[currentIndex > 0 ? currentIndex - 1 : albumMedia.length - 1]);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < albumMedia.length - 1 ? prev + 1 : 0));
    setSelectedMedia(albumMedia[currentIndex < albumMedia.length - 1 ? currentIndex + 1 : 0]);
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
            Galeri <span className="text-pmi">Kegiatan</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Dokumentasi kegiatan PMR Wira SMKN 1 Pringgabaya
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex gap-2">
            <button 
              onClick={() => setView('grid')} 
              className={`p-2 rounded-lg transition ${
                view === 'grid' 
                  ? 'bg-pmi text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {albums.length} Album • {galeri.length} Item
          </p>
        </motion.div>

        {/* Album Grid */}
        {albums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Belum Ada Album
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Admin belum menambahkan galeri foto/video. 
              Pantau terus website ini untuk dokumentasi kegiatan terbaru.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {albums.map((album, idx) => {
                const count = getAlbumCount(album.id);
                const cover = getAlbumCover(album.id);
                
                return (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      setSelectedAlbum(album);
                      setCurrentIndex(0);
                    }}
                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={cover} 
                        alt={album.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badge count */}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded-lg text-white text-xs flex items-center gap-1">
                        <Camera size={12} /> {count}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-bold text-lg truncate">
                          {album.nama}
                        </h3>
                        {album.deskripsi && (
                          <p className="text-white/80 text-sm truncate">
                            {truncateText(album.deskripsi, 40)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-pmi transition">
                        {album.nama}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {count} item
                        </p>
                        {album.deskripsi && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[60%]">
                            {truncateText(album.deskripsi, 20)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal Detail Album */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAlbum(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-start z-10 rounded-t-2xl">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold truncate">{selectedAlbum.nama}</h3>
                  {selectedAlbum.deskripsi && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {selectedAlbum.deskripsi}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedAlbum(null)} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition ml-2 flex-shrink-0"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {albumMedia.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="group relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    {item.tipe === 'foto' ? (
                      <img 
                        src={item.url} 
                        alt={item.judul || 'Foto'} 
                        className="w-full aspect-[4/5] object-cover cursor-pointer hover:scale-105 transition duration-300"
                        loading="lazy"
                        onClick={() => {
                          setSelectedMedia(item);
                          setCurrentIndex(index);
                        }}
                      />
                    ) : (
                      <video 
                        src={item.url} 
                        className="w-full aspect-[4/5] object-cover cursor-pointer hover:scale-105 transition duration-300"
                        onClick={() => {
                          setSelectedMedia(item);
                          setCurrentIndex(index);
                        }}
                      />
                    )}
                    
                    {/* Badge tipe */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-white text-xs flex items-center gap-1">
                      {item.tipe === 'video' ? <Video size={12} /> : <Camera size={12} />}
                      {item.tipe === 'video' ? 'Video' : 'Foto'}
                    </div>
                    
                    {/* Download button */}
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
                  </motion.div>
                ))}
                
                {albumMedia.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Camera size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500">Belum ada foto/video di album ini.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Preview Media */}
      <AnimatePresence>
        {selectedMedia && albumMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
              {/* Close button */}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition z-10"
              >
                <X size={24} />
              </button>
              
              {/* Download button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const filename = getFilename(selectedMedia.url, currentIndex);
                  handleDownload(selectedMedia.url, filename);
                }}
                className="absolute bottom-4 right-4 p-3 bg-pmi hover:bg-red-700 rounded-full text-white transition z-10 flex items-center gap-2 shadow-lg"
              >
                <Download size={20} /> Download
              </button>
              
              {/* Zoom toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition z-10"
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
              
              {/* Navigasi */}
              {albumMedia.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition z-10"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {/* Media */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ duration: 0.3 }}
                className="cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {selectedMedia.tipe === 'foto' ? (
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.judul || 'Foto'} 
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <video 
                    src={selectedMedia.url} 
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    controls
                    autoPlay
                  />
                )}
              </motion.div>
              
              {/* Info */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-lg">
                {selectedMedia.judul || `Media ${currentIndex + 1}`}
              </div>
              
              {/* Counter */}
              {albumMedia.length > 1 && (
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/40 text-xs bg-black/30 px-3 py-1 rounded-full">
                  {currentIndex + 1} / {albumMedia.length}
                </div>
              )}
              
              {/* Keterangan zoom */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-xs">
                {isZoomed ? 'Klik untuk zoom out' : 'Klik untuk zoom in'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GaleriPage;