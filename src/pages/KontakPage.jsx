import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, Instagram, Youtube, Send, MapPin, Phone, 
  Mail, Globe, Clock, MessageSquare, CheckCircle, 
  Loader2, Navigation, ThumbsUp, Eye, Shield, User
} from 'lucide-react';
import { supabase } from '../supabase/client';

const socialMedia = [
  { 
    name: 'Facebook', 
    icon: Facebook, 
    username: 'PMR Wira Smkn Prbya', 
    url: 'https://www.facebook.com/share/1FnbuMwaff/', 
    color: '#1877f2',
  },
  { 
    name: 'Instagram', 
    icon: Instagram, 
    username: 'laspraja_smkn1baya', 
    url: 'https://www.instagram.com/laspraja_smkn1baya', 
    color: '#e4405f',
  },
  { 
    name: 'TikTok', 
    icon: Send, 
    username: 'PMR WIRA SMKN 1 PRINGGABAYA', 
    url: 'https://www.tiktok.com/@pmrsmeksaofficial', 
    color: '#000000',
  },
  { 
    name: 'YouTube', 
    icon: Youtube, 
    username: 'PMR Wira Unit SMKN 1 Pringgabaya', 
    url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya', 
    color: '#ff0000',
  },
];

const KontakPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [isAnonim, setIsAnonim] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    try {
      // KALO ANONIM, NAME & EMAIL DIKOSONGIN
      const dataToSend = {
        nama: isAnonim ? 'Anonim' : formData.name,
        email: isAnonim ? 'anonim@pmr.com' : formData.email,
        pesan: formData.message,
        is_anonim: isAnonim,
        status: 'baru',
      };

      const { error } = await supabase
        .from('pesan')
        .insert([dataToSend]);
      
      if (error) throw error;
      
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 4000);
    } catch (err) {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hubungi <span className="text-pmi">Kami</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Ikuti media sosial kami atau hubungi kontak resmi PMR Wira SMKN 1 Pringgabaya
          </p>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📱</span> Media Sosial Resmi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialMedia.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
              >
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ backgroundColor: social.color }}
                >
                  <social.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{social.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-all line-clamp-1">
                  {social.username}
                </p>
                <p className="text-pmi text-sm mt-2 font-semibold group-hover:underline">
                  Kunjungi →
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Info Sekolah & Maps */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Alamat & Maps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-pmi" /> Alamat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              SMKN 1 Pringgabaya<br />
              Jl. Raya Mataram - Labuhan Lombok No.KM.3, Pringgabaya Utara, <br />
              Kec. Pringgabaya, Kabupaten Lombok Timur, Nusa Tenggara Bar. 83654
            </p>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=-8.53305,116.636264"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4 text-pmi hover:underline flex items-center gap-1 text-sm"
            >
              <Navigation size={16} /> Buka di Google Maps
            </a>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3945.123456789!2d116.636264!3d-8.53305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzEnNTkuMCJTIDExNsKwMzgnMTAuNiJF!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps SMKN 1 Pringgabaya"
                className="w-full h-full"
              />
            </div>

            {/* Jam Layanan */}
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Clock size={18} className="text-pmi" /> Jam Layanan
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="font-medium">08:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu</span>
                  <span className="font-medium">08:00 - 12:00</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Minggu / Libur</span>
                  <span className="font-medium">Tutup</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kontak & Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Informasi Kontak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <h2 className="text-2xl font-bold mb-4">Informasi Kontak</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                  <Phone className="w-5 h-5 text-pmi mt-0.5 group-hover:scale-110 transition" />
                  <div>
                    <p className="font-semibold">WhatsApp Admin</p>
                    <p className="text-gray-600 dark:text-gray-400">+62 859 7433 5511</p>
                    <a href="https://wa.me/6285974335511" className="text-pmi text-sm hover:underline flex items-center gap-1">
                      Chat via WhatsApp →
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                  <Mail className="w-5 h-5 text-pmi mt-0.5 group-hover:scale-110 transition" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">pmrsmeksabaya@gmail.com</p>
                    <a href="mailto:pmrsmeksabaya@gmail.com" className="text-pmi text-sm hover:underline">
                      Kirim Email →
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                  <Globe className="w-5 h-5 text-pmi mt-0.5 group-hover:scale-110 transition" />
                  <div>
                    <p className="font-semibold">Website Sekolah</p>
                    <a href="https://smkn1pringgabaya.sch.id" target="_blank" rel="noopener noreferrer" className="text-pmi hover:underline">
                      smkn1pringgabaya.sch.id
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Reply Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                <a 
                  href="https://wa.me/6285974335511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm"
                >
                  <Phone size={16} /> WhatsApp
                </a>
                <a 
                  href="mailto:pmrsmeksabaya@gmail.com"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                >
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>

            {/* Form Kirim Pesan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="text-pmi" /> Kirim Pesan
                <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <Shield size={12} /> Aman & Terenkripsi
                </span>
              </h2>
              
              {/* ANONIM TOGGLE */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-medium">Kirim sebagai Anonim</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonim(!isAnonim)}
                  className={`relative w-12 h-6 rounded-full transition ${
                    isAnonim ? 'bg-pmi' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isAnonim ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {isAnonim && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-lg flex items-center gap-2"
                >
                  <Shield size={14} /> Identitas Anda tidak akan terlihat oleh admin
                </motion.div>
              )}

              {isSent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Pesan berhasil dikirim!
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2"
                >
                  <span>⚠️</span> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isAnonim && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nama <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required={!isAnonim}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required={!isAnonim}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition"
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                  </>
                )}

                {isAnonim && (
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Eye size={16} /> Pesan akan dikirim secara anonim
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Pesan <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pmi transition resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-pmi text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Mengirim...
                    </>
                  ) : isSent ? (
                    <>
                      <CheckCircle size={18} /> Terkirim!
                    </>
                  ) : (
                    <>
                      <Send size={18} /> {isAnonim ? 'Kirim Anonim' : 'Kirim Pesan'}
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KontakPage;