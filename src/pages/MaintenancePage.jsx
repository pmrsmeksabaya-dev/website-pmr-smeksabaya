import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, Clock, Heart, Sparkles, 
  RefreshCw, Mail, AlertTriangle
} from 'lucide-react';
import { supabase } from '../supabase/client'; // <-- TAMBAHIN IMPORT INI

const MaintenancePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });
  const [message, setMessage] = useState(
    'Mohon maaf atas ketidaknyamanannya. Tim kami sedang melakukan perbaikan untuk meningkatkan kualitas website PMR Wira SMKN 1 Pringgabaya.'
  );
  const [isMaintenanceDone, setIsMaintenanceDone] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== AMBIL DATA DARI SUPABASE =====
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const { data, error } = await supabase
          .from('pengaturan_global')
          .select('key, value')
          .in('key', ['maintenance_end_time', 'maintenance_message']);

        if (error) throw error;

        const endTimeData = data?.find(d => d.key === 'maintenance_end_time');
        const messageData = data?.find(d => d.key === 'maintenance_message');

        // Set pesan dari database
        if (messageData?.value) {
          setMessage(messageData.value);
        }

        // Parse waktu dari database
        const targetDate = endTimeData?.value 
          ? new Date(endTimeData.value).getTime() 
          : new Date().getTime() + (24 * 60 * 60 * 1000); // Default 24 jam

        // Countdown
        const interval = setInterval(() => {
          const now = new Date().getTime();
          const distance = targetDate - now;

          if (distance < 0) {
            clearInterval(interval);
            setIsMaintenanceDone(true);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }, 1000);

        setLoading(false);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching maintenance data:', error);
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, []);

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-pmi border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-24 h-24 bg-pmi/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl w-full"
      >
        {/* ICON WRENCH */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-pmi/30 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pmi to-red-700 rounded-3xl flex items-center justify-center shadow-2xl">
              <Wrench className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-yellow-300 dark:border-yellow-700">
            <AlertTriangle size={16} />
            Website Sedang Dalam Perbaikan
          </div>
        </motion.div>

        {/* CARD */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-6 sm:p-10 text-center">
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3"
          >
            🚧 Web Sedang Diperbaiki
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto"
          >
            {message}
          </motion.p>

          {/* COUNTDOWN */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-center gap-2">
              <Clock size={14} />
              {isMaintenanceDone ? 'Perbaikan hampir selesai!' : 'Estimasi Kembali Normal:'}
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
              {[
                { value: timeLeft.days, label: 'Hari' },
                { value: timeLeft.hours, label: 'Jam' },
                { value: timeLeft.minutes, label: 'Menit' },
                { value: timeLeft.seconds, label: 'Detik' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-br from-pmi/10 to-red-700/10 dark:from-pmi/20 dark:to-red-700/20 rounded-xl p-2 sm:p-3 border border-pmi/20"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-pmi tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SPINNER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={16} className="text-pmi" />
            </motion.div>
            <span>
              {isMaintenanceDone 
                ? 'Perbaikan hampir selesai, silakan refresh halaman...' 
                : 'Progres perbaikan sedang berjalan...'
              }
            </span>
          </motion.div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6 text-left"
          >
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-pmi" />
              Apa yang sedang kami perbaiki?
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-pmi mt-0.5">•</span>
                <span>Peningkatan performa & kecepatan website</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pmi mt-0.5">•</span>
                <span>Perbaikan sistem galeri & upload foto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pmi mt-0.5">•</span>
                <span>Update fitur admin panel & notifikasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pmi mt-0.5">•</span>
                <span>Optimasi keamanan data</span>
              </li>
            </ul>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            <a
              href="https://wa.me/6285974335511"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm"
            >
              <Mail size={16} />
              WhatsApp
            </a>
            <a
              href="mailto:pmrsmeksabaya@gmail.com"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
            >
              <Mail size={16} />
              Email
            </a>
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6"
        >
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
            Dibuat dengan <Heart size={14} className="text-red-500 fill-red-500" /> oleh
            <span className="font-semibold text-pmi">PMR Wira SMKN 1 Pringgabaya</span>
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            © {new Date().getFullYear()} Laspraja. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;