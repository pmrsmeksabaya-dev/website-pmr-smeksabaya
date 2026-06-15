import { useState } from 'react';
import { Calendar, Clock, CheckCircle, Circle, Filter, Search, Target, Award } from 'lucide-react';

const programData = [
  { id: 1, title: "Bakti Sosial ke Panti Asuhan/Jompo", division: "Sosial", status: "Rencana", date: "3 kali/tahun", target: "Memberikan bantuan dan menumbuhkan kepedulian sosial anggota PMR" },
  { id: 2, title: "PMR Go Green", division: "Lingkungan", status: "Rencana", date: "2 kali/tahun", target: "Menumbuhkan kepedulian lingkungan" },
  { id: 3, title: "Kemah Survival Dasar di Alam Terbuka", division: "Pelatihan", status: "Rencana", date: "Saat semua proker berjalan", target: "Melatih kesiapsiagaan, P3K lapangan, kerja sama tim" },
  { id: 4, title: "Sosialisasi Pembentukan Relawan PMR (Madya & Mula)", division: "Keanggotaan", status: "Rencana", date: "2 kali/tahun", target: "Terbentuknya relawan PMR dengan pengetahuan dasar Kepalang Merahan" },
  { id: 5, title: "PMR Cek Kesehatan Sederhana", division: "UKS", status: "Rencana", date: "2 kali/tahun", target: "Memberikan edukasi untuk meningkatkan kesadaran hidup sehat" },
  { id: 6, title: "Lomba dan Event PMR", division: "Event", status: "Rencana", date: "2 kali/tahun", target: "Meningkatkan kreativitas & eksistensi" },
  { id: 7, title: "Open Recruitment dan Promosi", division: "Keanggotaan", status: "Rencana", date: "1 kali/tahun", target: "Menambah anggota baru & mencari calon anggota" },
  { id: 8, title: "Pembinaan Karakter Anggota", division: "Pembinaan", status: "Berjalan", date: "1 kali/minggu", target: "Membentuk anggota yang disiplin dan bertanggung jawab" },
  { id: 9, title: "Kampanye Kemanusiaan Digital", division: "Media", status: "Berjalan", date: "1 kali/minggu", target: "Meningkatkan keterampilan dalam Kesehatan dan pertolongan pertama" },
  { id: 10, title: "Pembuatan Video Tutorial P3K Singkat", division: "Media", status: "Berjalan", date: "1 kali/minggu", target: "Menumbuhkan rasa kepedulian sosial dan jiwa kemanusiaan" },
  { id: 11, title: "Gerakan Tangan Bersih", division: "UKS", status: "Berjalan", date: "1 kali/minggu", target: "Meningkatkan keaktifan organisasi melalui kegiatan positif" },
  { id: 12, title: "Kotak P3K Keliling", division: "UKS", status: "Berjalan", date: "1 kali/minggu", target: "Menciptakan lingkungan sekolah yang sehat, aman, dan peduli" },
  { id: 13, title: "Penyusunan Kalender Kegiatan PMR", division: "Sekretaris", status: "Selesai", date: "1 periode", target: "Menyusun agenda bulanan & mengatur jadwal latihan rutin" },
  { id: 14, title: "Kotak Saran Digital", division: "Humas", status: "Berjalan", date: "Setiap saat", target: "Menjadi jembatan evaluasi bagi pengurus inti" },
  { id: 15, title: "Program Celengan Kemanusiaan PMR", division: "Bendahara", status: "Berjalan", date: "4 kali/tahun", target: "Membiasakan rasa peduli & membantu menambah dana organisasi" },
  { id: 16, title: "Latgab (Latihan Gabungan)", division: "Pelatihan", status: "Rencana", date: "2 kali/tahun", target: "Menjalin hubungan baik dengan organisasi PMR di sekolah lain" },
  { id: 17, title: "Rubin 'Skenario Kejutan'", division: "Pelatihan", status: "Rahasia", date: "Rahasia", target: "Mengasah kesiapan psikologis dan kecepatan pengambilan keputusan" },
  { id: 18, title: "Bazar/Kewirausahaan", division: "Perlengkapan", status: "Rencana", date: "Setiap ada event sekolah", target: "Menambahkan kas PMR & melatih kewirausahaan" },
];

const divisions = ["Semua", "Sosial", "Lingkungan", "Pelatihan", "Keanggotaan", "UKS", "Event", "Pembinaan", "Media", "Sekretaris", "Humas", "Bendahara", "Perlengkapan"];
const statusColors = { Rencana: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", Berjalan: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", Selesai: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", Rahasia: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
const statusIcons = { Rencana: Circle, Berjalan: Clock, Selesai: CheckCircle, Rahasia: Award };

const ProgramPage = () => {
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('Semua');
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filtered = programData.filter(prog => {
    const matchSearch = prog.title.toLowerCase().includes(search.toLowerCase());
    const matchDivision = division === 'Semua' || prog.division === division;
    return matchSearch && matchDivision;
  });

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Program <span className="text-pmi">Kerja</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            PMR Wira SMKN 1 Pringgabaya memiliki <span className="font-bold text-pmi">18 Program Kerja</span> unggulan 
            yang terbagi dalam berbagai divisi untuk mencapai tujuan organisasi
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-pmi">{programData.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Proker</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-green-500">{programData.filter(p => p.status === 'Berjalan').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sedang Berjalan</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-yellow-500">{programData.filter(p => p.status === 'Rencana').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rencana</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-blue-500">{programData.filter(p => p.status === 'Selesai').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Telah Selesai</p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari program kerja..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi" 
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select 
              value={division} 
              onChange={e => setDivision(e.target.value)} 
              className="w-full pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              {divisions.map(div => <option key={div} value={div}>{div}</option>)}
            </select>
          </div>
        </div>

        {/* Program Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(prog => {
            const StatusIcon = statusIcons[prog.status] || Circle;
            return (
              <div 
                key={prog.id} 
                onClick={() => setSelectedProgram(prog)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-pmi/50"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold group-hover:text-pmi transition line-clamp-2">{prog.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ml-2 ${statusColors[prog.status]}`}>
                      <StatusIcon size={12} /> {prog.status}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center gap-1">
                    <span className="font-medium text-pmi">Divisi:</span> {prog.division}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar size={14} />
                    <span>{prog.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    <span className="font-medium">🎯 Tujuan:</span> {prog.target}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada program kerja yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal Detail Program */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProgram(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-pmi">{selectedProgram.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Divisi: {selectedProgram.division}</p>
              </div>
              <button onClick={() => setSelectedProgram(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b dark:border-gray-700">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusColors[selectedProgram.status]}`}>
                  {(() => {
                const IconComponent = statusIcons[selectedProgram.status];
                  return IconComponent ? <IconComponent size={14} /> : null;
                })()}
                  <span>{selectedProgram.status}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>{selectedProgram.date}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Target className="text-pmi" size={20} /> Tujuan Program
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedProgram.target}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold mb-2">📋 Informasi Tambahan</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Program kerja ini dikelola oleh Divisi {selectedProgram.division}</li>
                  <li>• Jadwal pelaksanaan: {selectedProgram.date}</li>
                  <li>• Status: {selectedProgram.status === 'Berjalan' ? 'Sedang aktif dilaksanakan' : selectedProgram.status === 'Rencana' ? 'Menunggu jadwal pelaksanaan' : selectedProgram.status === 'Selesai' ? 'Telah dilaksanakan' : 'Informasi terbatas'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramPage;