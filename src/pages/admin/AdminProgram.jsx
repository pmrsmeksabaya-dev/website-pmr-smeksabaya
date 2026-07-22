import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, X, Save, Calendar, Target, Loader2,
  Filter, ChevronDown, AlertCircle, CheckCircle, Info, RefreshCw
} from 'lucide-react';
import { supabase } from '../../supabase/client';

const divisions = ["Sosial", "Lingkungan", "Pelatihan", "Keanggotaan", "UKS", "Event", "Pembinaan", "Media", "Sekretaris", "Humas", "Bendahara", "Perlengkapan"];
const statuses = ["Rencana", "Berjalan", "Selesai", "Rahasia"];

const AdminProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterDivisi, setFilterDivisi] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    divisi: 'Pelatihan',
    status: 'Rencana',
    tanggal_mulai: '',
    tanggal_selesai: '',
  });

  // ========== FETCH DATA ==========
  useEffect(() => {
    fetchPrograms();

    const channel = supabase
      .channel('admin-program-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'program_kerja' },
        () => {
          console.log('📢 Program Kerja berubah (admin), refresh data...');
          fetchPrograms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      showToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========== TOAST ==========
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ========== GET STATUS COLOR ==========
  const getStatusColor = (status) => {
    const colors = {
      Rencana: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      Berjalan: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Selesai: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Rahasia: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // ========== MODAL ==========
  const handleOpenModal = (program = null) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        judul: program.judul,
        deskripsi: program.deskripsi || '',
        divisi: program.divisi,
        status: program.status,
        tanggal_mulai: program.tanggal_mulai || '',
        tanggal_selesai: program.tanggal_selesai || '',
      });
    } else {
      setEditingProgram(null);
      setFormData({
        judul: '',
        deskripsi: '',
        divisi: 'Pelatihan',
        status: 'Rencana',
        tanggal_mulai: '',
        tanggal_selesai: '',
      });
    }
    setIsModalOpen(true);
  };

  // ========== SAVE ==========
  const handleSave = async () => {
    if (!formData.judul || !formData.deskripsi) {
      showToast('Judul dan deskripsi harus diisi!', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        divisi: formData.divisi,
        status: formData.status,
        tanggal_mulai: formData.tanggal_mulai || null,
        tanggal_selesai: formData.tanggal_selesai || null,
      };

      if (editingProgram) {
        const { error } = await supabase
          .from('program_kerja')
          .update(dataToSave)
          .eq('id', editingProgram.id);
        
        if (error) throw error;
        showToast('Program berhasil diupdate!', 'success');
      } else {
        const { error } = await supabase
          .from('program_kerja')
          .insert([dataToSave]);
        
        if (error) throw error;
        showToast('Program berhasil ditambahkan!', 'success');
      }
      
      await fetchPrograms();
      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error('Error saving:', error);
      showToast('Gagal menyimpan data', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ========== DELETE ==========
  const handleDelete = (id, judul) => {
    setDeleteConfirm({ id, judul });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const { error } = await supabase
        .from('program_kerja')
        .delete()
        .eq('id', deleteConfirm.id);
      
      if (error) throw error;
      showToast(`Program "${deleteConfirm.judul}" berhasil dihapus!`, 'success');
      setDeleteConfirm(null);
      await fetchPrograms();
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Gagal menghapus data', 'error');
    }
  };

  // ========== FILTER ==========
  const filtered = programs.filter(prog => {
    const matchSearch = prog.judul.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || prog.status === filterStatus;
    const matchDivisi = filterDivisi === 'Semua' || prog.divisi === filterDivisi;
    return matchSearch && matchStatus && matchDivisi;
  });

  // Stats
  const stats = {
    total: programs.length,
    berjalan: programs.filter(p => p.status === 'Berjalan').length,
    rencana: programs.filter(p => p.status === 'Rencana').length,
    selesai: programs.filter(p => p.status === 'Selesai').length,
  };

  // Unique divisions for filter
  const uniqueDivisions = ['Semua', ...new Set(programs.map(p => p.divisi).filter(Boolean))];

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
          <h1 className="text-xl sm:text-2xl font-bold">📋 Kelola Program Kerja</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {programs.length} program kerja tersedia
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-pmi text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition text-sm sm:text-base"
        >
          <Plus size={16} /> <span className="hidden xs:inline">Tambah Program</span>
        </button>
      </motion.div>

      {/* ========== STATS ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6"
      >
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
          <p className="text-lg sm:text-2xl font-bold text-pmi">{stats.total}</p>
          <p className="text-[10px] sm:text-sm text-gray-500">Total Program</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
          <p className="text-lg sm:text-2xl font-bold text-green-500">{stats.berjalan}</p>
          <p className="text-[10px] sm:text-sm text-gray-500">Berjalan</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
          <p className="text-lg sm:text-2xl font-bold text-yellow-500">{stats.rencana}</p>
          <p className="text-[10px] sm:text-sm text-gray-500">Rencana</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow text-center">
          <p className="text-lg sm:text-2xl font-bold text-blue-500">{stats.selesai}</p>
          <p className="text-[10px] sm:text-sm text-gray-500">Selesai</p>
        </div>
      </motion.div>

      {/* ========== SEARCH & FILTER ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mb-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari program kerja..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-9 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              <option value="Semua">Semua Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <select 
              value={filterDivisi} 
              onChange={e => setFilterDivisi(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              {uniqueDivisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* ========== TABLE ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">No</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Nama Program</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase hidden sm:table-cell">Divisi</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Status</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((prog, idx) => (
                <motion.tr 
                  key={prog.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{idx + 1}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div>
                      <p className="font-medium text-xs sm:text-sm line-clamp-1">{prog.judul}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {prog.deskripsi?.slice(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                    {prog.divisi || '-'}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(prog.status)}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2">
                      <button onClick={() => handleOpenModal(prog)} className="text-blue-500 hover:text-blue-700 p-1 transition" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(prog.id, prog.judul)} className="text-red-500 hover:text-red-700 p-1 transition" title="Hapus">
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
              <Search size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {search || filterStatus !== 'Semua' || filterDivisi !== 'Semua'
                ? 'Tidak ada program yang cocok dengan filter'
                : 'Belum ada program kerja. Tambahkan program baru!'}
            </p>
          </div>
        ) : (
          <div className="p-3 sm:p-4 border-t dark:border-gray-700 text-[10px] sm:text-sm text-gray-500 flex flex-wrap justify-between gap-2">
            <span>Menampilkan {filtered.length} dari {programs.length} program</span>
            <span>Divisi: {uniqueDivisions.filter(d => d !== 'Semua').length}</span>
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
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-5 border-b dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold">
                  {editingProgram ? '✏️ Edit Program Kerja' : '➕ Tambah Program Kerja'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Program Kerja *</label>
                  <input 
                    type="text" 
                    value={formData.judul} 
                    onChange={e => setFormData({...formData, judul: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    placeholder="Contoh: Bakti Sosial ke Panti Asuhan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Divisi</label>
                    <select 
                      value={formData.divisi} 
                      onChange={e => setFormData({...formData, divisi: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    >
                      {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Calendar size={16} /> Tanggal Mulai
                    </label>
                    <input 
                      type="date" 
                      value={formData.tanggal_mulai} 
                      onChange={e => setFormData({...formData, tanggal_mulai: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Calendar size={16} /> Tanggal Selesai
                    </label>
                    <input 
                      type="date" 
                      value={formData.tanggal_selesai} 
                      onChange={e => setFormData({...formData, tanggal_selesai: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Target size={16} /> Deskripsi Program *
                  </label>
                  <textarea 
                    value={formData.deskripsi} 
                    onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi resize-none"
                    placeholder="Jelaskan deskripsi dan tujuan dari program kerja ini..."
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t dark:border-gray-700 flex flex-col xs:flex-row justify-end gap-2 sm:gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base">
                  Batal
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
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
                <h3 className="text-lg sm:text-xl font-bold mb-2">Hapus Program?</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                  Apakah Anda yakin ingin menghapus program <strong>"{deleteConfirm.judul}"</strong>?
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

export default AdminProgram;