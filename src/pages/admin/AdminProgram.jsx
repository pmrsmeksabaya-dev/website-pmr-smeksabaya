import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, Calendar, Target } from 'lucide-react';

const initialPrograms = [
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

const divisions = ["Sosial", "Lingkungan", "Pelatihan", "Keanggotaan", "UKS", "Event", "Pembinaan", "Media", "Sekretaris", "Humas", "Bendahara", "Perlengkapan"];
const statuses = ["Rencana", "Berjalan", "Selesai", "Rahasia"];

const AdminProgram = () => {
  const [programs, setPrograms] = useState(initialPrograms);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    division: 'Pelatihan',
    status: 'Rencana',
    date: '',
    target: ''
  });

  useEffect(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('pmr_programs');
    if (saved) {
      setPrograms(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pmr_programs', JSON.stringify(programs));
  }, [programs]);

  const filtered = programs.filter(prog =>
    prog.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (program = null) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title,
        division: program.division,
        status: program.status,
        date: program.date,
        target: program.target
      });
    } else {
      setEditingProgram(null);
      setFormData({
        title: '',
        division: 'Pelatihan',
        status: 'Rencana',
        date: '',
        target: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.target) {
      alert('Judul dan tujuan harus diisi!');
      return;
    }

    if (editingProgram) {
      setPrograms(programs.map(p => 
        p.id === editingProgram.id ? { ...formData, id: p.id } : p
      ));
    } else {
      const newId = Math.max(...programs.map(p => p.id), 0) + 1;
      setPrograms([...programs, { ...formData, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingProgram(null);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus program kerja ini?')) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Rencana: 'bg-yellow-100 text-yellow-700',
      Berjalan: 'bg-green-100 text-green-700',
      Selesai: 'bg-blue-100 text-blue-700',
      Rahasia: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Kelola Program Kerja</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus size={20} /> Tambah Program
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari program kerja..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Nama Program</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Divisi</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Waktu</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((prog, idx) => (
                <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium line-clamp-1">{prog.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{prog.target}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{prog.division}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prog.status)}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{prog.date}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(prog)} 
                      className="text-blue-500 hover:text-blue-700 transition p-1"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(prog.id)} 
                      className="text-red-500 hover:text-red-700 transition p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada program kerja yang ditemukan
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500">
          Total {filtered.length} dari {programs.length} program kerja
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingProgram ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Program Kerja *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Contoh: Bakti Sosial ke Panti Asuhan"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Divisi</label>
                  <select 
                    value={formData.division} 
                    onChange={e => setFormData({...formData, division: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  >
                    {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  >
                    {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Calendar size={16} /> Waktu Pelaksanaan
                </label>
                <input 
                  type="text" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Contoh: 2 kali/tahun, 1 kali/minggu, dll"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Target size={16} /> Tujuan Program *
                </label>
                <textarea 
                  value={formData.target} 
                  onChange={e => setFormData({...formData, target: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Jelaskan tujuan dari program kerja ini..."
                />
              </div>
            </div>

            <div className="p-5 border-t dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Batal
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgram;