import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, Upload, Loader2, User, UserCircle, Camera } from 'lucide-react';
import { supabase } from '../../supabase/client';

const AdminStruktur = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: 'Anggota',
    divisi: '-',
    gender: 'male',
    foto: null,
    fotoFile: null,
  });

  const jabatanOptions = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Ketua Divisi", "Anggota"];
  const divisiOptions = ["-", "Keanggotaan", "Media", "Perlengkapan", "Humas", "UKS"];
  const genderOptions = [
    { value: 'male', label: 'Laki-laki' },
    { value: 'female', label: 'Perempuan' },
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Gagal memuat data pengurus');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `pengurus/${fileName}`;

      // Cek bucket 'foto' ada atau tidak
      const { error: uploadError } = await supabase.storage
        .from('foto')
        .upload(filePath, file);

      if (uploadError) {
        // Jika bucket belum ada, coba buat dulu atau pakai bucket 'public'
        if (uploadError.message.includes('bucket not found')) {
          // Coba upload ke bucket 'public'
          const { error: uploadError2 } = await supabase.storage
            .from('public')
            .upload(filePath, file);
          
          if (uploadError2) throw uploadError2;
          
          const { data: { publicUrl } } = supabase.storage
            .from('public')
            .getPublicUrl(filePath);
          return publicUrl;
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('foto')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Gagal upload foto: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        nama: member.nama || '',
        jabatan: member.jabatan || 'Anggota',
        divisi: member.divisi || '-',
        gender: member.gender || 'male',
        foto: member.foto || null,
        fotoFile: null,
      });
    } else {
      setEditingMember(null);
      setFormData({
        nama: '',
        jabatan: 'Anggota',
        divisi: '-',
        gender: 'male',
        foto: null,
        fotoFile: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama) {
      alert('Nama harus diisi!');
      return;
    }

    let fotoUrl = formData.foto;

    // Upload foto jika ada file baru
    if (formData.fotoFile) {
      const uploadedUrl = await handleFileUpload(formData.fotoFile);
      if (uploadedUrl) {
        fotoUrl = uploadedUrl;
      }
    }

    const dataToSave = {
      nama: formData.nama,
      jabatan: formData.jabatan,
      divisi: formData.divisi,
      gender: formData.gender,
      foto: fotoUrl,
    };

    setUploading(true);
    try {
      if (editingMember) {
        const { error } = await supabase
          .from('pengurus')
          .update(dataToSave)
          .eq('id', editingMember.id);
        
        if (error) throw error;
        alert('Pengurus berhasil diupdate!');
      } else {
        // Dapatkan urutan terakhir
        const { data: lastData } = await supabase
          .from('pengurus')
          .select('urutan')
          .order('urutan', { ascending: false })
          .limit(1);
        
        const lastUrutan = lastData && lastData.length > 0 ? lastData[0].urutan : 0;
        
        const { error } = await supabase
          .from('pengurus')
          .insert([{
            ...dataToSave,
            urutan: lastUrutan + 1,
          }]);
        
        if (error) throw error;
        alert('Pengurus berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan data: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!confirm(`Yakin ingin menghapus "${nama}"?`)) return;

    try {
      const { error } = await supabase
        .from('pengurus')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      alert('Pengurus berhasil dihapus!');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus: ' + error.message);
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

  const getGenderIcon = (gender, size = 18) => {
    if (gender === 'female') {
      return <User className="text-pink-500" size={size} />;
    }
    return <UserCircle className="text-blue-500" size={size} />;
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
        <h1 className="text-2xl font-bold">👥 Kelola Struktur Organisasi</h1>
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Foto</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Jabatan</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Divisi</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((member, idx) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {member.foto ? (
                      <img src={member.foto} alt={member.nama} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getGenderIcon(member.gender, 20)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{member.nama}</p>
                      {member.divisi && member.divisi !== '-' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Divisi {member.divisi}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJabatanBadge(member.jabatan)}`}>
                      {member.jabatan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{member.divisi || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {member.gender === 'female' ? '👩 Perempuan' : '👨 Laki-laki'}
                  </td>
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

      {/* Modal Add/Edit - LENGKAP dengan FOTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingMember ? '✏️ Edit Pengurus' : '➕ Tambah Pengurus Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Foto Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Foto Profil</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-pmi/30">
                      {formData.fotoFile ? (
                        <img 
                          src={URL.createObjectURL(formData.fotoFile)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : formData.foto ? (
                        <img 
                          src={formData.foto} 
                          alt="Foto" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <Camera class="w-8 h-8 text-gray-400" />
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 p-1.5 bg-pmi text-white rounded-full cursor-pointer hover:bg-red-700 transition shadow-lg">
                      <Camera size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData({ ...formData, fotoFile: file });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Klik ikon kamera untuk upload
                    </p>
                    <p className="text-xs text-gray-400">Format: JPG, PNG • Max 2MB</p>
                    {formData.foto && !formData.fotoFile && (
                      <button
                        onClick={() => setFormData({ ...formData, foto: null })}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Hapus foto
                      </button>
                    )}
                    {formData.fotoFile && (
                      <button
                        onClick={() => setFormData({ ...formData, fotoFile: null })}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Batal pilih foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                <div className="flex gap-4">
                  {genderOptions.map(g => (
                    <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={g.value}
                        checked={formData.gender === g.value}
                        onChange={() => setFormData({...formData, gender: g.value})}
                        className="w-4 h-4 text-pmi focus:ring-pmi"
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t dark:border-gray-700 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSave} 
                disabled={uploading}
                className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {uploading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStruktur;