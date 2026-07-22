import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Loader2, X, CheckCircle, AlertCircle, 
  Globe, Mail, Phone, MapPin, Instagram, Facebook, Youtube, 
  Send, Link, Palette, Image, Users, Calendar, Award,
  Eye, EyeOff, RefreshCw, Share2
} from 'lucide-react';
import { supabase } from '../../supabase/client';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [previewHero, setPreviewHero] = useState(false);

  // ========== DEFAULT SETTINGS ==========
  const defaultSettings = {
    nama_organisasi: 'PMR Wira SMKN 1 Pringgabaya',
    tagline: 'Siap Menolong Sesama Dengan Tulus dan Ikhlas',
    whatsapp: '+62 859 7433 5511',
    email: 'pmrsmeksabaya@gmail.com',
    alamat: 'Jl. Raya Mataram - Labuhan Lombok No.KM.3, Pringgabaya Utara, Kec. Pringgabaya, Kabupaten Lombok Timur, NTB 83654',
    facebook: 'https://www.facebook.com/share/1FnbuMwaff/',
    instagram: 'https://www.instagram.com/laspraja_smkn1baya',
    tiktok: 'https://www.tiktok.com/@pmrsmeksaofficial',
    youtube: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya',
    url_pendaftaran: 'https://pmrsmeksabaya-daftar.vercel.app/',
    warna_primary: '#d32f2f',
    warna_secondary: '#8b0000',
    hero_judul: 'PMR WIRA SMKN 1 PRINGGABAYA',
    hero_subjudul: 'Organisasi Kepalangmerahan',
    hero_deskripsi: 'Membentuk generasi muda berjiwa kemanusiaan',
    stat_anggota: '30+',
    stat_program: '8+',
    stat_kegiatan: '4',
    stat_prestasi: '1',
  };

  // ========== FETCH SETTINGS ==========
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pengaturan_website')
        .select('*');

      if (error) throw error;

      // Convert array ke object
      const settingsObj = {};
      if (data) {
        data.forEach(item => {
          settingsObj[item.key] = item.value;
        });
      }

      // Merge dengan default
      setSettings({ ...defaultSettings, ...settingsObj });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(defaultSettings);
      showToast('Gagal memuat pengaturan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========== TOAST ==========
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ========== SAVE SETTINGS ==========
  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || '',
      }));

      // Upsert ke Supabase
      for (const item of updates) {
        const { error } = await supabase
          .from('pengaturan_website')
          .upsert({ key: item.key, value: item.value }, { onConflict: 'key' });

        if (error) throw error;
      }

      showToast('Pengaturan berhasil disimpan!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Gagal menyimpan pengaturan', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ========== UPDATE SETTINGS ==========
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // ========== RESET TO DEFAULT ==========
  const resetToDefault = () => {
    if (confirm('Reset semua pengaturan ke default?')) {
      setSettings(defaultSettings);
      showToast('Pengaturan direset ke default', 'success');
    }
  };

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
          <h1 className="text-xl sm:text-2xl font-bold">⚙️ Pengaturan Website</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola pengaturan tampilan dan konten website
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={resetToDefault}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none bg-pmi text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </motion.div>

      {/* ========== FORM SETTINGS ========== */}
      <div className="space-y-4 sm:space-y-6">
        {/* ===== INFORMASI UMUM ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-pmi" /> Informasi Umum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Organisasi</label>
              <input
                type="text"
                value={settings.nama_organisasi || ''}
                onChange={(e) => updateSetting('nama_organisasi', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => updateSetting('tagline', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        </motion.div>

        {/* ===== KONTAK ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone size={20} className="text-pmi" /> Kontak
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp</label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => updateSetting('whatsapp', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="+62 859 7433 5511"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => updateSetting('email', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="pmrsmeksabaya@gmail.com"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <label className="block text-sm font-medium mb-1">Alamat</label>
            <textarea
              value={settings.alamat || ''}
              onChange={(e) => updateSetting('alamat', e.target.value)}
              rows={2}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900 resize-none"
              placeholder="Jl. Raya Mataram - Labuhan Lombok No.KM.3..."
            />
          </div>
        </motion.div>

        {/* ===== MEDIA SOSIAL ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 size={20} className="text-pmi" /> Media Sosial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Facebook size={16} className="text-blue-600" /> Facebook
              </label>
              <input
                type="url"
                value={settings.facebook || ''}
                onChange={(e) => updateSetting('facebook', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Instagram size={16} className="text-pink-600" /> Instagram
              </label>
              <input
                type="url"
                value={settings.instagram || ''}
                onChange={(e) => updateSetting('instagram', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Send size={16} className="text-black dark:text-white" /> TikTok
              </label>
              <input
                type="url"
                value={settings.tiktok || ''}
                onChange={(e) => updateSetting('tiktok', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="https://tiktok.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Youtube size={16} className="text-red-600" /> YouTube
              </label>
              <input
                type="url"
                value={settings.youtube || ''}
                onChange={(e) => updateSetting('youtube', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </motion.div>

        {/* ===== LINK & TEMA ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Link Pendaftaran */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
              <Link size={20} className="text-pmi" /> Link Pendaftaran
            </h2>
            <input
              type="url"
              value={settings.url_pendaftaran || ''}
              onChange={(e) => updateSetting('url_pendaftaran', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              placeholder="https://pmrsmeksabaya-daftar.vercel.app/"
            />
          </div>

          {/* Tema */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={20} className="text-pmi" /> Tema Warna
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Warna Primary</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.warna_primary || '#d32f2f'}
                    onChange={(e) => updateSetting('warna_primary', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.warna_primary || ''}
                    onChange={(e) => updateSetting('warna_primary', e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Warna Secondary</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.warna_secondary || '#8b0000'}
                    onChange={(e) => updateSetting('warna_secondary', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.warna_secondary || ''}
                    onChange={(e) => updateSetting('warna_secondary', e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== HERO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <Image size={20} className="text-pmi" /> Hero Section
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Hero</label>
              <input
                type="text"
                value={settings.hero_judul || ''}
                onChange={(e) => updateSetting('hero_judul', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subjudul Hero</label>
              <input
                type="text"
                value={settings.hero_subjudul || ''}
                onChange={(e) => updateSetting('hero_subjudul', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi Hero</label>
              <input
                type="text"
                value={settings.hero_deskripsi || ''}
                onChange={(e) => updateSetting('hero_deskripsi', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        </motion.div>

        {/* ===== STATISTIK ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={20} className="text-pmi" /> Statistik (Homepage)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Users size={14} /> Anggota
              </label>
              <input
                type="text"
                value={settings.stat_anggota || ''}
                onChange={(e) => updateSetting('stat_anggota', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="30+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Calendar size={14} /> Program
              </label>
              <input
                type="text"
                value={settings.stat_program || ''}
                onChange={(e) => updateSetting('stat_program', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="8+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Award size={14} /> Kegiatan
              </label>
              <input
                type="text"
                value={settings.stat_kegiatan || ''}
                onChange={(e) => updateSetting('stat_kegiatan', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Award size={14} /> Prestasi
              </label>
              <input
                type="text"
                value={settings.stat_prestasi || ''}
                onChange={(e) => updateSetting('stat_prestasi', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pmi bg-white dark:bg-gray-900"
                placeholder="1"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;