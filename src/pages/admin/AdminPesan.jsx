import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Eye, CheckCircle, X, Clock, Trash2, 
  Loader2, Search, User, Shield, AlertCircle
} from 'lucide-react';
import { supabaseAdmin } from '../../supabase/adminClient';

const AdminPesan = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchMessages();

    // ===== REALTIME - ON DULU, BARU SUBSCRIBE =====
    const channel = supabaseAdmin
      .channel('admin-pesan-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pesan'
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => supabaseAdmin.removeChannel(channel);
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from('pesan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showToast('Gagal memuat pesan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { error } = await supabaseAdmin
        .from('pesan')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      showToast(`Status berhasil diubah`, 'success');
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Gagal mengubah status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;

    try {
      const { error } = await supabaseAdmin
        .from('pesan')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Pesan berhasil dihapus', 'success');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('Gagal menghapus pesan', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'baru': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: '📩 Baru' },
      'dibaca': { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: '👀 Dibaca' },
      'dibalas': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: '✅ Dibalas' },
    };
    return statusMap[status] || statusMap['baru'];
  };

  const filteredMessages = messages.filter(m =>
    m.nama?.toLowerCase().includes(search.toLowerCase()) ||
    m.pesan?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter(m => m.status === 'baru').length;
  const anonimCount = messages.filter(m => m.is_anonim).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-pmi animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📩 Pesan Masuk
            {unreadCount > 0 && (
              <span className="text-sm bg-pmi text-white px-3 py-1 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">
            Total {messages.length} pesan • {anonimCount} anonim
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="bg-pmi text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm"
        >
          <Loader2 size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pesan', value: messages.length, color: 'text-pmi', icon: Mail },
          { label: 'Belum Dibaca', value: unreadCount, color: 'text-blue-500', icon: Clock },
          { label: 'Sudah Dibalas', value: messages.filter(m => m.status === 'dibalas').length, color: 'text-green-500', icon: CheckCircle },
          { label: 'Anonim', value: anonimCount, color: 'text-purple-500', icon: Shield },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Cari pesan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi"
        />
      </div>

      {/* Messages Grid */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <Mail size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500">Belum ada pesan</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer border-l-4 ${
                msg.status === 'baru' ? 'border-pmi' : 'border-transparent'
              }`}
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {msg.is_anonim ? (
                      <Shield size={16} className="text-purple-500" />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                    <p className="font-medium">
                      {msg.is_anonim ? '🕵️ Anonim' : msg.nama}
                    </p>
                    {msg.is_anonim && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        Anonim
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {msg.pesan}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{new Date(msg.created_at).toLocaleDateString('id-ID')}</span>
                    <span>{new Date(msg.created_at).toLocaleTimeString('id-ID')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(msg.status).color}`}>
                    {getStatusBadge(msg.status).label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    {selectedMessage.is_anonim ? (
                      <Shield size={20} className="text-purple-500" />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                    <h3 className="text-xl font-bold">
                      {selectedMessage.is_anonim ? '🕵️ Anonim' : selectedMessage.nama}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedMessage.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedMessage.status).color}`}>
                  {getStatusBadge(selectedMessage.status).label}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.pesan}
                </p>
              </div>

              <div className="text-xs text-gray-400 mb-4">
                <p>Dikirim: {new Date(selectedMessage.created_at).toLocaleString('id-ID')}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {selectedMessage.status === 'baru' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedMessage.id, 'dibaca');
                      setSelectedMessage(null);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                  >
                    <Eye size={16} /> Tandai Dibaca
                  </button>
                )}
                {selectedMessage.status !== 'dibalas' && (
                  <button
                    onClick={() => {
                      if (selectedMessage.email && !selectedMessage.is_anonim) {
                        window.open(`mailto:${selectedMessage.email}`, '_blank');
                      } else {
                        window.open('mailto:pmrsmeksabaya@gmail.com', '_blank');
                      }
                      handleStatusChange(selectedMessage.id, 'dibalas');
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm"
                  >
                    <Mail size={16} /> Balas
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPesan;