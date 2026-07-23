import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, X, Save, Upload, Loader2, 
  User, UserCircle, Camera, Users, Clock, AlertCircle, 
  CheckCircle, Info
} from 'lucide-react';
import { supabase } from '../../supabase/client';


const AdminStruktur = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('resmi');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: 'Anggota',
    divisi: '-',
    gender: 'male',
    foto: null,
    fotoFile: null,
    tipe_pengurus: 'resmi',
    keterangan: '',
  });

  const jabatanOptions = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Ketua Divisi", "Anggota"];
  const divisiOptions = ["-", "Keanggotaan", "Media", "Perlengkapan", "Humas", "UKS"];
  const genderOptions = [
    { value: 'male', label: 'Laki-laki' },
    { value: 'female', label: 'Perempuan' },
  ];
  const tipeOptions = [
    { value: 'resmi', label: 'Pengurus Resmi' },
    { value: 'sementara', label: 'Pengurus Sementara' },
  ];

  // ========== FETCH DATA ==========
  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel('admin-struktur-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengurus' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
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
      showToast('Gagal memuat data pengurus', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========== TOAST ==========
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ========== FILE UPLOAD ==========
  const handleFileUpload = async (file) => {
    if (!file) return null;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `pengurus/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('foto')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
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
      showToast('Gagal upload foto: ' + error.message, 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ========== MODAL ==========
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
        tipe_pengurus: member.tipe_pengurus || 'resmi',
        keterangan: member.keterangan || '',
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
        tipe_pengurus: activeTab === 'resmi' ? 'resmi' : 'sementara',
        keterangan: '',
      });
    }
    setIsModalOpen(true);
  };

  // ========== SAVE ==========
  const handleSave = async () => {
    if (!formData.nama) {
      showToast('Nama harus diisi!', 'error');
      return;
    }

    let fotoUrl = formData.foto;

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
      tipe_pengurus: formData.tipe_pengurus,
      keterangan: formData.keterangan,
    };

    setUploading(true);
    try {
      if (editingMember) {
        const { error } = await supabase
          .from('pengurus')
          .update(dataToSave)
          .eq('id', editingMember.id);
        
        if (error) throw error;
        showToast('Pengurus berhasil diupdate!', 'success');
      } else {
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
        showToast('Pengurus berhasil ditambahkan!', 'success');
      }

      setIsModalOpen(false);
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Gagal menyimpan data: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  // ========== DELETE ==========
  const handleDelete = (id, nama) => {
    setDeleteConfirm({ id, nama });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await supabase
        .from('pengurus')
        .delete()
        .eq('id', deleteConfirm.id);
      
      if (error) throw error;
      showToast(`"${deleteConfirm.nama}" berhasil dihapus!`, 'success');
      setDeleteConfirm(null);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Gagal menghapus: ' + error.message, 'error');
    }
  };

  // ========== HELPERS ==========
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

  const getTipeBadge = (tipe) => {
    if (tipe === 'sementara') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  };

  const getGenderIcon = (gender, size = 18) => {
    if (gender === 'female') {
      return <User className="text-pink-500" size={size} />;
    }
    return <UserCircle className="text-blue-500" size={size} />;
  };

  // ========== FILTER ==========
  const filteredByTab = members.filter(m => 
    activeTab === 'resmi' ? m.tipe_pengurus === 'resmi' : m.tipe_pengurus === 'sementara'
  );

  const filtered = filteredByTab.filter(m =>
    m.nama.toLowerCase().includes(search.toLowerCase())
  );

  const resmiCount = members.filter(m => m.tipe_pengurus === 'resmi').length;
  const sementaraCount = members.filter(m => m.tipe_pengurus === 'sementara').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-pmi animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      {/* ========== TOAST ========== */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm w-full ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm flex-1">{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: 'success' })}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== HEADER ========== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">👥 Kelola Struktur</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {members.length} pengurus terdaftar
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-pmi text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition text-sm sm:text-base"
        >
          <Plus size={16} /> <span className="hidden xs:inline">Tambah Pengurus</span>
        </button>
      </motion.div>

      {/* ========== INFO ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex flex-wrap gap-4 items-center"
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-medium">Total:</span>
          <span className="font-bold text-pmi">{members.length}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Resmi: {resmiCount}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span>Sementara: {sementaraCount}</span>
        </div>
      </motion.div>

      {/* ========== TAB ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        <button
          onClick={() => setActiveTab('resmi')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
            activeTab === 'resmi'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Users size={16} />
          <span className="hidden xs:inline">Pengurus Resmi</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'resmi' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            {resmiCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('sementara')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
            activeTab === 'sementara'
              ? 'bg-yellow-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Clock size={16} />
          <span className="hidden xs:inline">Pengurus Sementara</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === 'sementara' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            {sementaraCount}
          </span>
        </button>
      </motion.div>

      {/* ========== SEARCH ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-3 sm:p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={`Cari ${activeTab === 'resmi' ? 'pengurus resmi' : 'pengurus sementara'}...`} 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi" 
            />
          </div>
        </div>

        {/* ========== TABLE ========== */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">No</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Foto</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Nama</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase hidden sm:table-cell">Jabatan</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase hidden md:table-cell">Divisi</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase hidden lg:table-cell">Keterangan</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((member, idx) => (
                <motion.tr 
                  key={member.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{idx + 1}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    {member.foto ? (
                      <img 
                        src={member.foto} 
                        alt={member.nama} 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">${getGenderIcon(member.gender, 16)}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getGenderIcon(member.gender, 16)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div>
                      <p className="font-medium text-xs sm:text-sm line-clamp-1">{member.nama}</p>
                      <span className={`text-[8px] sm:text-xs px-1.5 py-0.5 rounded-full ${getTipeBadge(member.tipe_pengurus)}`}>
                        {member.tipe_pengurus === 'sementara' ? 'Sementara' : 'Resmi'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium ${getJabatanBadge(member.jabatan)}`}>
                      {member.jabatan}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
                    {member.divisi || '-'}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                    {member.keterangan || '-'}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2">
                      <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:text-blue-700 p-1 transition" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(member.id, member.nama)} className="text-red-500 hover:text-red-700 p-1 transition" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="flex justify-center mb-4">
              <Users size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {search 
                ? `Tidak ada ${activeTab === 'resmi' ? 'pengurus resmi' : 'pengurus sementara'} yang cocok` 
                : `Belum ada ${activeTab === 'resmi' ? 'pengurus resmi' : 'pengurus sementara'}`}
            </p>
          </div>
        ) : (
          <div className="p-3 sm:p-4 border-t dark:border-gray-700 text-[10px] sm:text-sm text-gray-500 flex flex-wrap justify-between gap-2">
            <span>Menampilkan {filtered.length} dari {members.length} pengurus</span>
            <span className="flex gap-3 sm:gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Resmi: {resmiCount}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Sementara: {sementaraCount}
              </span>
            </span>
          </div>
        )}
      </motion.div>

      {/* ========== MODAL ========== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-5 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold">
                  {editingMember ? '✏️ Edit Pengurus' : '➕ Tambah Pengurus'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                {/* Foto Upload */}
                <div>
  <label className="block text-sm font-medium mb-2">Foto Profil</label>
  <div className="flex flex-col xs:flex-row items-center gap-4">
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-pmi/30">
        {photoPreview ? (
          <img 
            src={photoPreview} 
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
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
        )}
      </div>
      <label className="absolute -bottom-1 -right-1 p-1.5 bg-pmi text-white rounded-full cursor-pointer hover:bg-red-700 transition shadow-lg">
        <Camera size={12} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({ ...formData, fotoFile: file });
              const reader = new FileReader();
              reader.onload = (event) => {
                setPhotoPreview(event.target.result);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />
      </label>
    </div>
    <div className="text-center xs:text-left">
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
        Klik ikon kamera untuk upload
      </p>
      <p className="text-[10px] text-gray-400">Format: JPG, PNG • Max 2MB</p>
      {(photoPreview || formData.foto) && (
        <button
          type="button"
          onClick={() => {
            setPhotoPreview(null);
            setFormData({ ...formData, foto: null, fotoFile: null });
          }}
          className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 mt-1"
        >
          🗑️ Hapus foto
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
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: Nadia Amanda Sari"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jabatan</label>
                    <select 
                      value={formData.jabatan} 
                      onChange={e => setFormData({...formData, jabatan: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {jabatanOptions.map(jab => <option key={jab} value={jab}>{jab}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Divisi</label>
                    <select 
                      value={formData.divisi} 
                      onChange={e => setFormData({...formData, divisi: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {divisiOptions.map(div => <option key={div} value={div}>{div === '-' ? 'Tidak Ada' : div}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jenis Pengurus</label>
                    <select 
                      value={formData.tipe_pengurus} 
                      onChange={e => setFormData({...formData, tipe_pengurus: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {tipeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                    <select 
                      value={formData.gender} 
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {genderOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Keterangan (Opsional)</label>
                  <input 
                    type="text" 
                    value={formData.keterangan} 
                    onChange={e => setFormData({...formData, keterangan: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: PKL, Cuti, dll"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t dark:border-gray-700 flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={uploading}
                  className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {uploading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== DELETE CONFIRM MODAL ========== */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Hapus Pengurus?</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus <strong>"{deleteConfirm.nama}"</strong>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStruktur;