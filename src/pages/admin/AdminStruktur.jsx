import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, Upload, Loader2 } from 'lucide-react';

const initialStruktur = {
  ketua: { id: 1, nama: "Nadia Amanda Sari", jabatan: "Ketua", divisi: "-", urutan: 1 },
  wakil: { id: 2, nama: "Yudha Akhira", jabatan: "Wakil Ketua", divisi: "-", urutan: 2 },
  sekretaris: [
    { id: 3, nama: "Zuhratul Hasanah", jabatan: "Sekretaris", divisi: "-", urutan: 3 },
    { id: 4, nama: "Safa Safira", jabatan: "Sekretaris", divisi: "-", urutan: 4 },
  ],
  bendahara: { id: 5, nama: "Saskia Riyanti", jabatan: "Bendahara", divisi: "-", urutan: 5 },
  ketuaDivisi: { id: 6, nama: "Hesta Wardani", jabatan: "Ketua Divisi", divisi: "-", urutan: 6 },
  divisiKeanggotaan: [
    { id: 7, nama: "Tuti Lestari", jabatan: "Anggota", divisi: "Keanggotaan", urutan: 7 },
    { id: 8, nama: "Umar Mujahid Hafidz Zhulloh", jabatan: "Anggota", divisi: "Keanggotaan", urutan: 8 },
  ],
  divisiMedia: [
    { id: 9, nama: "Nia Asmalika", jabatan: "Anggota", divisi: "Media", urutan: 9 },
    { id: 10, nama: "Siti Rauhun", jabatan: "Anggota", divisi: "Media", urutan: 10 },
  ],
  divisiPerlengkapan: [
    { id: 11, nama: "M. Ajwa", jabatan: "Anggota", divisi: "Perlengkapan", urutan: 11 },
    { id: 12, nama: "Saepudin Amsir", jabatan: "Anggota", divisi: "Perlengkapan", urutan: 12 },
  ],
  divisiHumas: [
    { id: 13, nama: "Nur Fadila", jabatan: "Anggota", divisi: "Humas", urutan: 13 },
    { id: 14, nama: "Olipia Zuliatul Fitri", jabatan: "Anggota", divisi: "Humas", urutan: 14 },
  ],
  divisiUKS: [
    { id: 15, nama: "Cici Rezilda Putri", jabatan: "Anggota", divisi: "UKS", urutan: 15 },
  ],
};

// Konversi ke array flat untuk tabel
const getAllMembers = () => {
  const members = [];
  members.push(initialStruktur.ketua);
  members.push(initialStruktur.wakil);
  members.push(...initialStruktur.sekretaris);
  members.push(initialStruktur.bendahara);
  members.push(initialStruktur.ketuaDivisi);
  members.push(...initialStruktur.divisiKeanggotaan);
  members.push(...initialStruktur.divisiMedia);
  members.push(...initialStruktur.divisiPerlengkapan);
  members.push(...initialStruktur.divisiHumas);
  members.push(...initialStruktur.divisiUKS);
  return members;
};

const jabatanOptions = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Ketua Divisi", "Anggota"];
const divisiOptions = ["-", "Keanggotaan", "Media", "Perlengkapan", "Humas", "UKS"];

const AdminStruktur = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: 'Anggota',
    divisi: '-',
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    setLoading(true);
    // Simulate load from localStorage or API
    const saved = localStorage.getItem('pmr_struktur');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers(getAllMembers());
      localStorage.setItem('pmr_struktur', JSON.stringify(getAllMembers()));
    }
    setLoading(false);
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem('pmr_struktur', JSON.stringify(data));
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        nama: member.nama,
        jabatan: member.jabatan,
        divisi: member.divisi,
      });
    } else {
      setEditingMember(null);
      setFormData({
        nama: '',
        jabatan: 'Anggota',
        divisi: '-',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama) {
      alert('Nama harus diisi!');
      return;
    }

    let newMembers;
    if (editingMember) {
      newMembers = members.map(m => 
        m.id === editingMember.id ? { ...formData, id: m.id, urutan: m.urutan } : m
      );
    } else {
      const newId = Math.max(...members.map(m => m.id), 0) + 1;
      newMembers = [...members, { ...formData, id: newId, urutan: members.length + 1 }];
    }
    
    setMembers(newMembers);
    saveToLocalStorage(newMembers);
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDelete = (id, nama) => {
    if (confirm(`Yakin ingin menghapus "${nama}"?`)) {
      const newMembers = members.filter(m => m.id !== id);
      setMembers(newMembers);
      saveToLocalStorage(newMembers);
    }
  };

  const filtered = members.filter(m =>
    m.nama.toLowerCase().includes(search.toLowerCase())
  );

  const getJabatanBadge = (jabatan) => {
    const colors = {
      'Ketua': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Wakil Ketua': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Sekretaris': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Bendahara': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Ketua Divisi': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Anggota': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[jabatan] || 'bg-gray-100 text-gray-700';
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
        <h1 className="text-2xl font-bold">Kelola Struktur Organisasi</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus size={20} /> Tambah Pengurus
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari pengurus..." 
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Jabatan</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Divisi</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((member, idx) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{member.nama}</p>
                      {member.divisi !== '-' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Divisi {member.divisi}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJabatanBadge(member.jabatan)}`}>
                      {member.jabatan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{member.divisi}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(member.id, member.nama)} className="text-red-500 hover:text-red-700 p-1">
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
            Tidak ada pengurus yang ditemukan
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500">
          Total {filtered.length} dari {members.length} pengurus
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingMember ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                <input 
                  type="text" 
                  value={formData.nama} 
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Contoh: Nadia Amanda Sari"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Jabatan</label>
                  <select 
                    value={formData.jabatan} 
                    onChange={e => setFormData({...formData, jabatan: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  >
                    {jabatanOptions.map(jab => <option key={jab} value={jab}>{jab}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Divisi</label>
                  <select 
                    value={formData.divisi} 
                    onChange={e => setFormData({...formData, divisi: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  >
                    {divisiOptions.map(div => <option key={div} value={div}>{div === '-' ? 'Tidak Ada' : div}</option>)}
                  </select>
                </div>
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

export default AdminStruktur;