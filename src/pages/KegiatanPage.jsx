import { useState } from 'react';
import { Calendar, User, Search, Filter, PlusCircle } from 'lucide-react';

const KegiatanPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  // KOSONGKAN DULU - nanti diisi admin
  const kegiatanData = [];

  const categories = ["Semua"];

  const filtered = kegiatanData.filter(k => {
    const matchSearch = k?.judul?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchCategory = category === 'Semua' || k?.kategori === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Kegiatan & <span className="text-pmi">Berita</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Informasi kegiatan terbaru PMR Wira SMKN 1 Pringgabaya</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari berita..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800" 
              disabled
            />
          </div>
          <div className="relative md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full pl-10 pr-8 py-2 border rounded-lg bg-white dark:bg-gray-800"
              disabled
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <PlusCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Belum Ada Kegiatan</h3>
          <p className="text-gray-500">Kegiatan dan berita akan segera diupdate oleh admin.</p>
          <p className="text-gray-400 text-sm mt-2">Silakan cek kembali nanti!</p>
        </div>
      </div>
    </div>
  );
};

export default KegiatanPage;