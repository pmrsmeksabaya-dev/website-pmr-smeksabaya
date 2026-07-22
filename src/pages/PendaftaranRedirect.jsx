import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, AlertCircle, ArrowLeft, Mail, Calendar, Users, 
  Shield, Heart, Loader2, Instagram, Youtube, Send,
  ChevronRight, Sparkles
} from 'lucide-react';
import logoPmr from '../assets/pmr.png';

const PendaftaranRedirect = () => {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    // Estimasi selesai perbaikan
    const now = new Date();
    const estimated = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    setEstimatedTime(estimated.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }));

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto redirect
  useEffect(() => {
    if (countdown === 0) {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  }, [countdown]);

  const infoPendaftaran = [
    {
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      title: "Pendaftaran Ditutup Sementara",
      desc: "Kami sedang melakukan perbaikan sistem pendaftaran. Mohon bersabar."
    },
    {
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      title: "Info Pendaftaran",
      desc: "Pendaftaran akan dibuka kembali setelah sistem selesai diperbaiki."
    },
    {
      icon: <Users className="w-5 h-5 text-green-500" />,
      title: "Tetap Semangat",
      desc: "Jangan khawatir, semua data pendaftaran sebelumnya aman dan terjaga."
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      title: "Sistem Aman",
      desc: "Kami memastikan keamanan data calon anggota PMR."
    }
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container-custom">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pmi transition mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Card Utama */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-6 text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="flex justify-center mb-4"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Pendaftaran Sedang Diperbaiki
              </h2>
              <p className="text-white/90 mt-2">
                Sistem pendaftaran sedang dalam perbaikan
              </p>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              {/* Logo & Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 mb-6"
              >
                <motion.img 
                  src={logoPmr} 
                  alt="PMR" 
                  className="w-16 h-16 object-contain"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    PMR WIRA SMKN 1 Pringgabaya
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Organisasi Kepalangmerahan
                  </p>
                </div>
              </motion.div>

              {/* Countdown with Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Anda akan dialihkan ke halaman utama dalam
                </p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <p className="text-3xl font-bold text-pmi">
                    {countdown > 0 ? countdown : '0'} detik
                  </p>
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-pmi to-red-500 rounded-full"
                    />
                  </div>
                </div>
                {countdown === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Link 
                      to="/" 
                      className="inline-block mt-3 bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Kembali ke Beranda Sekarang
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Estimasi Waktu */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6"
              >
                Estimasi selesai perbaikan: <span className="font-semibold text-pmi">{estimatedTime}</span> WIB
              </motion.p>

              {/* Info Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
              >
                {infoPendaftaran.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition cursor-default group"
                  >
                    <motion.div 
                      className="mt-0.5"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Tombol Alternatif */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-t dark:border-gray-700 pt-6"
              >
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Sambil menunggu, kamu bisa lihat kegiatan kami:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link 
                    to="/kegiatan" 
                    className="px-4 py-2 bg-pmi/10 text-pmi rounded-lg hover:bg-pmi hover:text-white transition flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    Lihat Kegiatan
                  </Link>
                  <Link 
                    to="/galeri" 
                    className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition flex items-center gap-2"
                  >
                    <Heart size={16} />
                    Galeri Foto
                  </Link>
                  <Link 
                    to="/kontak" 
                    className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Hubungi Kami
                  </Link>
                </div>
              </motion.div>

              {/* Social Media Quick Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-4 border-t dark:border-gray-700 text-center"
              >
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                  Ikuti kami di media sosial
                </p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://www.instagram.com/laspraja_smkn1baya" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition hover:scale-110 transform duration-200"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@pmrsmeksaofficial" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-black dark:hover:text-white transition hover:scale-110 transform duration-200"
                  >
                    <Send size={20} />
                  </a>
                  <a 
                    href="https://www.youtube.com/@pmrwira.smkn1pringgabaya" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-600 transition hover:scale-110 transform duration-200"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6"
          >
            Website PMR Wira Unit SMKN 1 Pringgabaya • {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default PendaftaranRedirect;