import { useState } from 'react';
import { Calendar, User, Search, Filter, ArrowRight } from 'lucide-react';

const kegiatanData = [
  { id: 1, title: "Pelatihan P3K Dasar", date: "15 Oktober 2024", author: "Admin PMR", category: "Pelatihan", content: "Pelatihan pertolongan pertama bagi anggota baru...", img: "https://placehold.co/600x400" },
  { id: 2, title: "Donor Darah PMI", date: "20 September 2024", author: "Divisi Humas", category: "Sosial", content: "Kegiatan donor darah bekerja sama dengan PMI...", img: "https://placehold.co/600x400" },
  { id: 3, title: "Simulasi Bencana Alam", date: "5 Agustus 2024", author: "Divisi Keanggotaan", category: "Simulasi", content: "Simulasi tanggap darurat gempa bumi...", img: "https://placehold.co/600x400" },
];

const categories = ["Semua", "Pelatihan", "Sosial", "Simulasi"];

const KegiatanPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const filtered = kegiatanData.filter(k => {
    const matchSearch = k.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || k.category === category;
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
            <input type="text" placeholder="Cari berita..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select value={category} onChange={e => setCategory(e.target.value)} className="pl-10 pr-8 py-2 border rounded-lg bg-white dark:bg-gray-800">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(kegiatan => (
            <div key={kegiatan.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <img src={kegiatan.img} alt={kegiatan.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
              <div className="p-5">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {kegiatan.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {kegiatan.author}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-pmi transition">{kegiatan.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{kegiatan.content}</p>
                <button className="text-pmi font-semibold flex items-center gap-1 hover:gap-2 transition">Baca Selengkapnya <ArrowRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KegiatanPage;