import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertCircle, ArrowLeft, Mail, Calendar, Users, Shield, Heart, Loader2 } from 'lucide-react';
import logoPmr from '../assets/pmr.png';

const PendaftaranRedirect = () => {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
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

  // Info pendaftaran sementara
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
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pmi transition mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
          Kembali ke Beranda
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Card Utama */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header - Bergaya seperti banner peringatan */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-10 h-10 text-white" />
                </div>
              </div>
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
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={logoPmr} 
                  alt="PMR" 
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    PMR WIRA SMKN 1 Pringgabaya
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Organisasi Kepalangmerahan
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Anda akan dialihkan ke halaman utama dalam
                </p>
                <p className="text-3xl font-bold text-pmi mt-1">
                  {countdown > 0 ? countdown : '0'} detik
                </p>
                {countdown === 0 && (
                  <Link 
                    to="/" 
                    className="inline-block mt-3 bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Kembali ke Beranda Sekarang
                  </Link>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {infoPendaftaran.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition"
                  >
                    <div className="mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tombol Alternatif */}
              <div className="border-t dark:border-gray-700 pt-6">
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
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Website PMR Wira Unit SMKN 1 Pringgabaya • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendaftaranRedirect;