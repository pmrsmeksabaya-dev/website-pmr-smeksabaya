import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, Calendar, Target, Loader2 } from 'lucide-react';
import { supabase } from '../../supabase/client';

const divisions = ["Sosial", "Lingkungan", "Pelatihan", "Keanggotaan", "UKS", "Event", "Pembinaan", "Media", "Sekretaris", "Humas", "Bendahara", "Perlengkapan"];
const statuses = ["Rencana", "Berjalan", "Selesai", "Rahasia"];

const AdminProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    divisi: 'Pelatihan',
    status: 'Rencana',
    tanggal_mulai: '',
    tanggal_selesai: '',
  });

  useEffect(() => {
    fetchPrograms();

    // Realtime subscription
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
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!formData.judul || !formData.deskripsi) {
      alert('Judul dan deskripsi harus diisi!');
      return;
    }

    setSaving(true);
    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('program_kerja')
          .update({
            judul: formData.judul,
            deskripsi: formData.deskripsi,
            divisi: formData.divisi,
            status: formData.status,
            tanggal_mulai: formData.tanggal_mulai || null,
            tanggal_selesai: formData.tanggal_selesai || null,
          })
          .eq('id', editingProgram.id);
        
        if (error) throw error;
        alert('Program berhasil diupdate');
      } else {
        const { error } = await supabase
          .from('program_kerja')
          .insert([{
            judul: formData.judul,
            deskripsi: formData.deskripsi,
            divisi: formData.divisi,
            status: formData.status,
            tanggal_mulai: formData.tanggal_mulai || null,
            tanggal_selesai: formData.tanggal_selesai || null,
          }]);
        
        if (error) throw error;
        alert('Program berhasil ditambahkan');
      }
      await fetchPrograms();
      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, judul) => {
    if (confirm(`Yakin ingin menghapus program "${judul}"?`)) {
      try {
        const { error } = await supabase
          .from('program_kerja')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        alert('Program berhasil dihapus');
        await fetchPrograms();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Gagal menghapus data');
      }
    }
  };

  const filtered = programs.filter(prog =>
    prog.judul.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      Rencana: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      Berjalan: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Selesai: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Rahasia: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
        <h1 className="text-2xl font-bold">📋 Kelola Program Kerja</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <Plus size={20} /> Tambah Program
        </button>
      </div>

      {/* Info Total Program */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Calendar size={18} className="text-blue-500" />
          <span>
            Total <strong>{programs.length}</strong> program kerja
          </span>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
            {programs.filter(p => p.status === 'Berjalan').length} aktif
          </span>
        </div>
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filtered.map((prog, idx) => (
                <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3 text-sm">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium line-clamp-1">{prog.judul}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {prog.deskripsi?.slice(0, 60)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{prog.divisi || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prog.status)}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleOpenModal(prog)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(prog.id, prog.judul)} className="text-red-500 hover:text-red-700 p-1">
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

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500 flex justify-between">
          <span>Total {filtered.length} dari {programs.length} program</span>
          <span>Divisi: {divisions.filter(d => d !== 'Semua').length}</span>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingProgram ? '✏️ Edit Program Kerja' : '➕ Tambah Program Kerja Baru'}
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
                  value={formData.judul} 
                  onChange={e => setFormData({...formData, judul: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Contoh: Bakti Sosial ke Panti Asuhan"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Divisi</label>
                  <select 
                    value={formData.divisi} 
                    onChange={e => setFormData({...formData, divisi: e.target.value})}
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Tanggal Mulai
                  </label>
                  <input 
                    type="date" 
                    value={formData.tanggal_mulai} 
                    onChange={e => setFormData({...formData, tanggal_mulai: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi"
                  placeholder="Jelaskan deskripsi dan tujuan dari program kerja ini..."
                />
              </div>
            </div>

            <div className="p-5 border-t dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Batal
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-4 py-2 bg-pmi text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgram;