import { useState } from 'react';
import { X, Camera, Video, LayoutGrid } from 'lucide-react';

const albums = [
  { id: 1, name: "Pelatihan P3K 2024", type: "foto", count: 12, cover: "https://placehold.co/600x400" },
  { id: 2, name: "Donor Darah PMI", type: "foto", count: 8, cover: "https://placehold.co/600x400" },
  { id: 3, name: "Simulasi Bencana", type: "video", count: 3, cover: "https://placehold.co/600x400" },
];

const GaleriPage = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [view, setView] = useState('grid');

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
          <p className="text-sm text-gray-500">{albums.length} album</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map(album => (
            <div key={album.id} onClick={() => setSelectedAlbum(album)} className="group cursor-pointer">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img src={album.cover} alt={album.name} className="w-full h-64 object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  {album.type === 'foto' ? <Camera size={40} className="text-white" /> : <Video size={40} className="text-white" />}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold">{album.name}</h3>
                  <p className="text-white/80 text-sm">{album.count} {album.type === 'foto' ? 'foto' : 'video'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAlbum(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{selectedAlbum.name}</h3>
              <button onClick={() => setSelectedAlbum(null)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(selectedAlbum.count)].map((_, i) => (
                <img key={i} src={`https://placehold.co/400x300`} alt={`Gambar ${i + 1}`} className="rounded-lg w-full h-48 object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriPage;