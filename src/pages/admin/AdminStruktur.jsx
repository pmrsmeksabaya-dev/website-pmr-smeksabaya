import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, X, Save, Loader2, 
  User, UserCircle, Camera, Users, Clock, AlertCircle, 
  CheckCircle, Download, Crop as CropIcon
} from 'lucide-react';
import { supabase } from '../../supabase/client';
import { supabaseAdmin } from '../../supabase/adminClient';
import * as XLSX from 'xlsx';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const AdminStruktur = () => {
  // ========== STATE ==========
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // ===== CROP STATE =====
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [tempFile, setTempFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  const aspectOptions = [
    { label: '1:1 (Kotak)', value: 1 },
    { label: '4:3 (Landscape)', value: 4/3 },
    { label: '3:4 (Portrait)', value: 3/4 },
    { label: '16:9 (Wide)', value: 16/9 },
    { label: '9:16 (Vertical)', value: 9/16 },
    { label: 'Bebas', value: null },
  ];

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

  // ========== TOAST ==========
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ========== AUDIT LOG ==========
  const logActivity = useCallback(async (action, tableName, recordId, details) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action,
        table_name: tableName,
        record_id: recordId,
        details: details || {}
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, []);

  // ========== FETCH DATA ==========
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resmiData, error: resmiError } = await supabaseAdmin
        .from('pengurus_resmi')
        .select('*')
        .order('urutan', { ascending: true });

      if (resmiError) throw resmiError;

      const { data: sementaraData, error: sementaraError } = await supabaseAdmin
        .from('pengurus_sementara')
        .select('*')
        .order('urutan', { ascending: true });

      if (sementaraError) throw sementaraError;

      const resmi = (resmiData || []).map(item => ({
        ...item,
        tipe_pengurus: 'resmi'
      }));

      const sementara = (sementaraData || []).map(item => ({
        ...item,
        tipe_pengurus: 'sementara'
      }));

      const allMembers = [...resmi, ...sementara];
      setMembers(allMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      showToast('Gagal memuat data pengurus', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ========== REALTIME ==========
  useEffect(() => {
    fetchMembers();

    const channel = supabaseAdmin
      .channel('admin-struktur-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengurus_resmi' }, () => {
        fetchMembers();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengurus_sementara' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => supabaseAdmin.removeChannel(channel);
  }, [fetchMembers]);

  // ========== CROP COMPLETE ==========
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // ========== GENERATE CROPPED IMAGE ==========
  const generateCroppedImage = useCallback(async () => {
    try {
      setIsCropping(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      
      const file = new File([croppedImageBlob], tempFile?.name || 'cropped.jpg', {
        type: 'image/jpeg',
      });
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      
      setFormData(prev => ({ ...prev, fotoFile: file }));
      
      setIsCropModalOpen(false);
      setImageSrc(null);
      setTempFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setAspectRatio(1);
      showToast('Foto berhasil dipotong!', 'success');
    } catch (error) {
      console.error('Error cropping image:', error);
      showToast('Gagal memotong foto', 'error');
    } finally {
      setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, tempFile, showToast]);

  // ========== FILE SELECT HANDLER ==========
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > MAX_SIZE) {
      showToast('Ukuran file maksimal 5MB!', 'error');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Hanya JPG, PNG, WEBP, atau GIF!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setTempFile(file);
      setIsCropModalOpen(true);
    };
  }, [showToast]);

  // ========== FILE UPLOAD ==========
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `pengurus/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('pengurus')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type || 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        showToast('Gagal upload foto: ' + uploadError.message, 'error');
        return null;
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('pengurus')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('Gagal upload foto: ' + error.message, 'error');
      return null;
    } finally {
      setUploading(false);
    }
  }, [showToast]);

  // ========== CHECK DUPLICATE ==========
  const checkDuplicate = useCallback(async (nama, excludeId = null) => {
    const { data: resmi } = await supabaseAdmin
      .from('pengurus_resmi')
      .select('id')
      .eq('nama', nama)
      .neq('id', excludeId || '');

    const { data: sementara } = await supabaseAdmin
      .from('pengurus_sementara')
      .select('id')
      .eq('nama', nama)
      .neq('id', excludeId || '');

    return [...(resmi || []), ...(sementara || [])].length > 0;
  }, []);

  // ========== SAVE ==========
  const handleSave = useCallback(async () => {
    if (!formData.nama.trim()) {
      showToast('Nama harus diisi!', 'error');
      return;
    }

    const isDuplicate = await checkDuplicate(formData.nama, editingMember?.id);
    if (isDuplicate && !editingMember) {
      showToast(`Nama "${formData.nama}" sudah terdaftar!`, 'error');
      return;
    }

    let fotoUrl = formData.foto;

    if (formData.fotoFile) {
      const uploadedUrl = await handleFileUpload(formData.fotoFile);
      if (uploadedUrl) {
        fotoUrl = uploadedUrl;
      } else if (!formData.foto) {
        showToast('Gagal upload foto, melanjutkan tanpa foto', 'warning');
      }
    }

    const dataToSave = {
      nama: formData.nama.trim(),
      jabatan: formData.jabatan,
      divisi: formData.divisi,
      gender: formData.gender,
      foto: fotoUrl,
      keterangan: formData.keterangan.trim(),
    };

    const table = formData.tipe_pengurus === 'resmi' 
      ? 'pengurus_resmi' 
      : 'pengurus_sementara';

    setUploading(true);
    try {
      if (editingMember) {
        const { error } = await supabaseAdmin
          .from(table)
          .update(dataToSave)
          .eq('id', editingMember.id);

        if (error) throw error;

        await logActivity('UPDATE', table, editingMember.id, dataToSave);
        showToast('Pengurus berhasil diupdate!', 'success');
      } else {
        const { data: lastData } = await supabaseAdmin
          .from(table)
          .select('urutan')
          .order('urutan', { ascending: false })
          .limit(1);

        const lastUrutan = lastData && lastData.length > 0 ? lastData[0].urutan : 0;

        const { data: inserted, error } = await supabaseAdmin
          .from(table)
          .insert([{
            ...dataToSave,
            urutan: lastUrutan + 1,
          }])
          .select()
          .single();

        if (error) throw error;

        await logActivity('INSERT', table, inserted.id, dataToSave);
        showToast('Pengurus berhasil ditambahkan!', 'success');
      }

      setIsModalOpen(false);
      setEditingMember(null);
      setPhotoPreview(null);
      setFormData(prev => ({ ...prev, fotoFile: null }));
      fetchMembers();
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Gagal menyimpan data: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  }, [formData, editingMember, handleFileUpload, checkDuplicate, logActivity, showToast, fetchMembers]);

  // ========== DELETE ==========
  const handleDelete = useCallback((id, nama) => {
    setDeleteConfirm({ id, nama });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm) return;

    try {
      const table = activeTab === 'resmi' 
        ? 'pengurus_resmi' 
        : 'pengurus_sementara';

      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('id', deleteConfirm.id);

      if (error) throw error;

      await logActivity('DELETE', table, deleteConfirm.id, { nama: deleteConfirm.nama });
      showToast(`"${deleteConfirm.nama}" berhasil dihapus!`, 'success');
      setDeleteConfirm(null);
      setSelectedIds(prev => prev.filter(id => id !== deleteConfirm.id));
      fetchMembers();
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Gagal menghapus: ' + error.message, 'error');
    }
  }, [deleteConfirm, activeTab, logActivity, showToast, fetchMembers]);

  // ========== BULK DELETE ==========
  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Hapus ${selectedIds.length} pengurus terpilih?`)) return;

    setIsBulkDeleting(true);
    try {
      const table = activeTab === 'resmi' 
        ? 'pengurus_resmi' 
        : 'pengurus_sementara';

      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      await logActivity('BULK_DELETE', table, null, { ids: selectedIds, count: selectedIds.length });
      showToast(`${selectedIds.length} pengurus berhasil dihapus!`, 'success');
      setSelectedIds([]);
      fetchMembers();
    } catch (error) {
      console.error('Error bulk deleting:', error);
      showToast('Gagal menghapus: ' + error.message, 'error');
    } finally {
      setIsBulkDeleting(false);
    }
  }, [selectedIds, activeTab, logActivity, showToast, fetchMembers]);

  // ========== EXPORT TO EXCEL ==========
  const handleExport = useCallback(() => {
    const exportData = members.map(m => ({
      Nama: m.nama,
      Jabatan: m.jabatan,
      Divisi: m.divisi,
      'Jenis Kelamin': m.gender === 'female' ? 'Perempuan' : 'Laki-laki',
      Tipe: m.tipe_pengurus === 'resmi' ? 'Resmi' : 'Sementara',
      Keterangan: m.keterangan || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pengurus');
    XLSX.writeFile(wb, `struktur_pengurus_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Data berhasil diexport!', 'success');
  }, [members, showToast]);

  // ========== HELPER FUNCTIONS ==========
  const getJabatanBadge = useCallback((jabatan) => {
    const colors = {
      'Ketua': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Wakil Ketua': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Sekretaris': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Bendahara': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Ketua Divisi': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Anggota': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[jabatan] || 'bg-gray-100 text-gray-700';
  }, []);

  const getTipeBadge = useCallback((tipe) => {
    if (tipe === 'sementara') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  }, []);

  // ========== OPEN MODAL ==========
  const handleOpenModal = useCallback((member = null) => {
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
      setPhotoPreview(member.foto || null);
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
      setPhotoPreview(null);
    }
    setIsModalOpen(true);
  }, [activeTab]);

  // ========== FILTER ==========
  const filteredByTab = members.filter(m => 
    activeTab === 'resmi' ? m.tipe_pengurus === 'resmi' : m.tipe_pengurus === 'sementara'
  );

  const filtered = filteredByTab.filter(m =>
    m.nama.toLowerCase().includes(search.toLowerCase()) ||
    m.jabatan.toLowerCase().includes(search.toLowerCase()) ||
    m.divisi.toLowerCase().includes(search.toLowerCase())
  );

  const resmiCount = members.filter(m => m.tipe_pengurus === 'resmi').length;
  const sementaraCount = members.filter(m => m.tipe_pengurus === 'sementara').length;

  // ========== RENDER ==========
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
                : toast.type === 'error' 
                ? 'bg-red-500 text-white'
                : 'bg-yellow-500 text-white'
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
        className="flex flex-wrap justify-between items-start sm:items-center gap-3 mb-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">👥 Kelola Struktur</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {members.length} pengurus terdaftar • {resmiCount} resmi • {sementaraCount} sementara
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition text-sm"
          >
            <Download size={16} />
            <span className="hidden xs:inline">Export</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-pmi text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition text-sm"
          >
            <Plus size={16} />
            <span className="hidden xs:inline">Tambah</span>
          </button>
        </div>
      </motion.div>

      {/* ========== TABS ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        <button
          onClick={() => setActiveTab('resmi')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
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
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
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

      {/* ========== SEARCH & BULK ACTIONS ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-3 sm:p-4 border-b dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={`Cari ${activeTab === 'resmi' ? 'pengurus resmi' : 'pengurus sementara'}...`} 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi" 
            />
          </div>
          
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition text-sm disabled:opacity-50"
            >
              {isBulkDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              Hapus ({selectedIds.length})
            </button>
          )}
        </div>

        {/* ========== TABLE ========== */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filtered.map(m => m.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="rounded border-gray-300 text-pmi focus:ring-pmi"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase">No</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase">Foto</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase">Nama</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase hidden sm:table-cell">Jabatan</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase hidden md:table-cell">Divisi</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase hidden lg:table-cell">Keterangan</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((member, idx) => (
                <motion.tr 
                  key={member.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, member.id]);
                        } else {
                          setSelectedIds(selectedIds.filter(id => id !== member.id));
                        }
                      }}
                      className="rounded border-gray-300 text-pmi focus:ring-pmi"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm">{idx + 1}</td>  
                  <td className="px-3 py-3">
                    {member.foto ? (
                      <img 
                        src={member.foto} 
                        alt={member.nama} 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const fallback = document.createElement('div');
                          fallback.className = 'w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center';
                          fallback.innerHTML = member.gender === 'female' 
                            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                          parent.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {member.gender === 'female' ? (
                          <User className="text-pink-500" size={18} />
                        ) : (
                          <UserCircle className="text-blue-500" size={18} />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{member.nama}</p>
                      <span className={`text-[8px] sm:text-xs px-1.5 py-0.5 rounded-full ${getTipeBadge(member.tipe_pengurus)}`}>
                        {member.tipe_pengurus === 'sementara' ? 'Sementara' : 'Resmi'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium ${getJabatanBadge(member.jabatan)}`}>
                      {member.jabatan}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm hidden md:table-cell">
                    {member.divisi || '-'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 hidden lg:table-cell">
                    {member.keterangan || '-'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleOpenModal(member)} 
                        className="text-blue-500 hover:text-blue-700 p-1 transition" 
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(member.id, member.nama)} 
                        className="text-red-500 hover:text-red-700 p-1 transition" 
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========== EMPTY STATE ========== */}
        {filtered.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="flex justify-center mb-4">
              <Users size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {search 
                ? `Tidak ada ${activeTab === 'resmi' ? 'pengurus resmi' : 'pengurus sementara'} yang cocok` 
                : `Belum ada ${activeTab === 'resmi' ? 'pengurus resmi' : 'pengurus sementara'}`}
            </p>
          </div>
        )}

        {/* ========== FOOTER ========== */}
        {filtered.length > 0 && (
          <div className="p-3 sm:p-4 border-t dark:border-gray-700 text-sm text-gray-500 flex flex-wrap justify-between items-center gap-2">
            <span>Total {filtered.length} pengurus</span>
          </div>
        )}
      </motion.div>

      {/* ========== MODAL TAMBAH/EDIT ========== */}
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
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-5 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-base sm:text-xl font-bold">
                  {editingMember ? '✏️ Edit Pengurus' : '➕ Tambah Pengurus'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                {/* Foto Upload WITH CROP + EDIT */}
                <div>
                  <label className="block text-sm font-medium mb-2">Foto Profil</label>
                  <div className="flex flex-col xs:flex-row items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-pmi/30">
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
                          />
                        ) : (
                          <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
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
                              handleFileSelect(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="text-center xs:text-left flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.foto ? 'Klik ikon kamera untuk ganti foto' : 'Klik ikon kamera untuk upload foto'}
                      </p>
                      <p className="text-[10px] text-gray-400">Max 5MB • JPG/PNG/WEBP</p>
                      <p className="text-[10px] text-pmi">✨ Bisa crop & atur posisi foto</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(photoPreview || formData.foto) && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoPreview(null);
                                setFormData({ ...formData, foto: null, fotoFile: null });
                              }}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Hapus foto
                            </button>
                            <label className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
                              Edit foto
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    handleFileSelect(file);
                                  }
                                }}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    value={formData.nama} 
                    onChange={e => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: Nadia Amanda Sari"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jabatan</label>
                    <select 
                      value={formData.jabatan} 
                      onChange={e => setFormData({...formData, jabatan: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {jabatanOptions.map(jab => <option key={jab} value={jab}>{jab}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Divisi</label>
                    <select 
                      value={formData.divisi} 
                      onChange={e => setFormData({...formData, divisi: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {divisiOptions.map(div => <option key={div} value={div}>{div === '-' ? 'Tidak Ada' : div}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jenis Pengurus</label>
                    <select 
                      value={formData.tipe_pengurus} 
                      onChange={e => setFormData({...formData, tipe_pengurus: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      <option value="resmi">Pengurus Resmi</option>
                      <option value="sementara">Pengurus Sementara</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                    <select 
                      value={formData.gender} 
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: PKL, Cuti, dll"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t dark:border-gray-700 flex flex-col xs:flex-row justify-end gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={uploading}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-pmi text-white hover:bg-red-700'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      {formData.fotoFile ? 'Uploading...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MODAL CROP ========== */}
      <AnimatePresence>
        {isCropModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
            onClick={() => {
              setIsCropModalOpen(false);
              setImageSrc(null);
              setTempFile(null);
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setAspectRatio(1);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center z-10">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <CropIcon size={20} className="text-pmi" />
                  Potong Foto
                </h2>
                <button 
                  onClick={() => {
                    setIsCropModalOpen(false);
                    setImageSrc(null);
                    setTempFile(null);
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setAspectRatio(1);
                  }} 
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Aspek Ratio */}
              <div className="p-4 border-b dark:border-gray-700">
                <label className="block text-sm font-medium mb-2">Pilih Aspek Rasio</label>
                <div className="flex flex-wrap gap-2">
                  {aspectOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAspectRatio(opt.value)}
                      className={`px-3 py-1.5 text-xs rounded-full transition ${
                        aspectRatio === opt.value
                          ? 'bg-pmi text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Area */}
              <div className="relative w-full h-[300px] bg-gray-900">
                {imageSrc && (
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape={aspectRatio === 1 ? 'round' : 'rect'}
                    showGrid={true}
                    style={{
                      containerStyle: {
                        width: '100%',
                        height: '100%',
                      },
                    }}
                  />
                )}
              </div>

              {/* Controls - TOMBOL TERAPKAN & BATAL */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-500">Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsCropModalOpen(false);
                      setImageSrc(null);
                      setTempFile(null);
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                      setAspectRatio(1);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={generateCroppedImage}
                    disabled={isCropping}
                    className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isCropping ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Terapkan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== DELETE CONFIRM ========== */}
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
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