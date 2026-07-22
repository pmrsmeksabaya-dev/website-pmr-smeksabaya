import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, FileText, Users, Calendar, ExternalLink, 
  Phone, Mail, HelpCircle, ChevronDown, Clock, 
  Award, Heart, Target, Sparkles
} from 'lucide-react';

// ============= FAQ DATA =============
const faqs = [
  {
    q: 'Apakah ada biaya pendaftaran?',
    a: 'Tidak ada biaya pendaftaran. Pendaftaran GRATIS untuk seluruh siswa/i SMKN 1 Pringgabaya.'
  },
  {
    q: 'Apa saja kegiatan yang akan diikuti?',
    a: 'Latihan rutin, simulasi bencana, donor darah, UKS, dan kegiatan sosial lainnya.'
  },
  {
    q: 'Apakah boleh mendaftar di luar periode?',
    a: 'Boleh! Pendaftaran dibuka sepanjang tahun ajaran.'
  },
  {
    q: 'Apakah ada batasan kuota?',
    a: 'Ya, untuk Gelombang 1 kuota terbatas 100 pendaftar. Segera daftar!'
  },
];

const PendaftaranPage = () => {
  const requirements = [
    'Siswa/i aktif SMKN 1 Pringgabaya',
    'Usia 15-18 tahun',
    'Sehat jasmani dan rohani',
    'Bersedia mengikuti seluruh kegiatan PMR',
  ];

  const benefits = [
    'Pelatihan Pertolongan Pertama',
    'Pengetahuan kebencanaan',
    'Pengalaman organisasi',
    'Sertifikat kegiatan',
    'Relasi luas',
    'Prestasi dan penghargaan',
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block bg-pmi/10 p-4 rounded-full mb-4"
          >
            <Sparkles className="w-12 h-12 text-pmi" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Pendaftaran <span className="text-pmi">Anggota PMR</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Bergabunglah menjadi anggota PMR Wira Unit SMKN 1 Pringgabaya dan jadilah generasi tanggap bencana
          </p>
        </motion.div>

        {/* Stats Sederhana */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center hover:shadow-lg transition">
            <Users className="w-6 h-6 text-pmi mx-auto mb-1" />
            <p className="text-2xl font-bold text-pmi">30+</p>
            <p className="text-sm text-gray-500">Anggota Aktif</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center hover:shadow-lg transition">
            <Target className="w-6 h-6 text-pmi mx-auto mb-1" />
            <p className="text-2xl font-bold text-pmi">8+</p>
            <p className="text-sm text-gray-500">Program Kerja</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center col-span-2 md:col-span-1 hover:shadow-lg transition">
            <Award className="w-6 h-6 text-pmi mx-auto mb-1" />
            <p className="text-2xl font-bold text-pmi">100</p>
            <p className="text-sm text-gray-500">Kuota Pendaftaran</p>
          </div>
        </motion.div>

        {/* Syarat & Keuntungan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pmi/10 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-pmi" />
              </div>
              <h2 className="text-2xl font-bold">Syarat Pendaftaran</h2>
            </div>
            <ul className="space-y-3">
              {requirements.map((req, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{req}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pmi/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-pmi" />
              </div>
              <h2 className="text-2xl font-bold">Keuntungan Bergabung</h2>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-pmi mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Timeline - SEDERHANA TANPA COUNTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-pmi/10 to-maroon/10 dark:from-pmi/20 dark:to-maroon/20 rounded-xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="bg-pmi/20 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-pmi" />
            </div>
            <h2 className="text-2xl font-bold">Periode Pendaftaran</h2>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Pendaftaran dibuka sepanjang tahun ajaran. Gelombang pendaftaran utama:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 text-center border-2 border-pmi/30 shadow-md min-w-[200px]"
            >
              <p className="font-semibold text-pmi flex items-center justify-center gap-1">
                <span className="bg-pmi text-white text-xs px-2 py-0.5 rounded-full">Aktif</span>
                Gelombang 1
              </p>
              <p className="text-sm font-medium mt-1">14 Juli - 8 Agustus 2026</p>
              <p className="text-xs text-gray-500">Kuota: 100 pendaftar</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 text-center border-2 border-gray-200 dark:border-gray-700 min-w-[200px]"
            >
              <p className="font-semibold text-gray-400 flex items-center justify-center gap-1">
                <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">Akan Datang</span>
                Gelombang 2
              </p>
              <p className="text-sm font-medium mt-1">November - Desember</p>
              <p className="text-xs text-gray-500">Informasi menyusul</p>
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <div className="bg-pmi/10 p-2 rounded-lg">
              <HelpCircle className="w-6 h-6 text-pmi" />
            </div>
            Pertanyaan Umum
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <motion.details
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-pmi/30 transition"
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition" />
                </summary>
                <p className="px-4 pb-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </motion.div>

        {/* Kontak Bantuan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <div className="bg-pmi/10 p-2 rounded-lg">
              <Phone className="w-6 h-6 text-pmi" />
            </div>
            Butuh Bantuan?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Hubungi panitia pendaftaran untuk informasi lebih lanjut:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
              <Phone className="w-5 h-5 text-pmi" />
              <div>
                <p className="text-xs text-gray-500">WhatsApp</p>
                <a href="https://wa.me/6285974335511" className="text-pmi hover:underline font-medium">
                  +62 859 7433 5511
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
              <Mail className="w-5 h-5 text-pmi" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href="mailto:pmrsmeksabaya@gmail.com" className="text-pmi hover:underline font-medium">
                  pmrsmeksabaya@gmail.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.a
            href="https://pmrsmeksabaya-daftar.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pmi to-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition shadow-lg"
          >
            <Heart className="w-5 h-5" />
            Daftar Sekarang
            <ExternalLink size={20} />
          </motion.a>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Klik tombol di atas untuk mengisi formulir pendaftaran online
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PendaftaranPage;