import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Target, Eye, BookOpen, Shield, Users, Calendar, Award, Sparkles } from 'lucide-react';

const ProfilePage = () => {
  const visi = "Mewujudkan PMR SMKN 1 Pringgabaya sebagai organisasi yang aktif, disiplin, profesional, dan berjiwa kemanusiaan, serta mampu menjadi teladan dalam kepedulian, kesiapsiagaan, dan kerja sama di lingkungan sekolah maupun masyarakat.";
  
  const misi = [
    "Meningkatkan kedisiplinan dan rasa tanggung jawab anggota PMR dengan membangun keaktifan dalam kegiatan, tepat waktu, dan komitmen terhadap tugas.",
    "Mengembangkan keterampilan dan kemampuan anggota PMR melalui latihan rutin, simulasi, dan kegiatan kepalangmerahan agar setiap anggota siap bertindak dalam situasi darurat.",
    "Memperkuat rasa kebersamaan dan kekompakan antaranggota dengan menciptakan suasana organisasi yang saling menghargai, mendukung, menghormati, dan bekerja sama sebagai satu tim.",
    "Mengaktifkan peran PMR dalam kegiatan sekolah dan sosial supaya PMR tidak hanya hadir sebagai organisasi, tetapi juga sebagai garda kemanusiaan di lingkungan sekolah dan masyarakat.",
    "Meningkatkan citra dan kepercayaan terhadap PMR dengan menunjukkan sikap profesional, sopan, dan siap membantu siapa pun yang membutuhkan.",
    "Mendorong anggota agar lebih percaya diri dan berani berperan baik dalam kepemimpinan, komunikasi, maupun dalam setiap kegiatan PMR.",
  ];

  const triBakti = [
    "Meningkatkan keterampilan hidup sehat",
    "Berkarya dan berbakti di masyarakat",
    "Mempererat persahabatan nasional dan internasional",
  ];

  const tujuhPrinsip = [
    "Kemanusiaan", "Kesamaan", "Kemandirian", 
    "Kesukarelaan", "Kesatuan", "Kesemestaan", "Kenetralan"
  ];

  const nilaiOrganisasi = [
    "Kemanusiaan", "Kepemimpinan", "Solidaritas", 
    "Kerelawanan", "Kedisiplinan", "Kesiapsiagaan"
  ];

  const stats = [
    { value: '30+', label: 'Anggota Aktif', icon: Users },
    { value: '8+', label: 'Program Kerja', icon: Target },
    { value: '4', label: 'Kegiatan Tahunan', icon: Calendar },
    { value: '1', label: 'Prestasi', icon: Award },
  ];

  const sejarah = [
    { tahun: '1950', desc: 'PMR resmi berdiri di Indonesia' },
    { tahun: '2023', desc: 'PMR Wira SMKN 1 Pringgabaya didirikan' },
    { tahun: '2025', desc: 'Mencapai 30+ anggota aktif' },
    { tahun: '2026', desc: 'Peluncuran website resmi PMR Wira' },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Profil <span className="text-pmi">PMR Wira</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Palang Merah Remaja Wira Unit SMKN 1 Pringgabaya
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition">
              <stat.icon className="w-8 h-8 text-pmi mx-auto mb-2" />
              <p className="text-2xl font-bold text-pmi">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tentang PMR */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="text-pmi" /> Tentang PMR Wira
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Palang Merah Remaja (PMR) adalah wadah pembinaan dan pengembangan anggota remaja 
            Palang Merah Indonesia (PMI) yang bertujuan membentuk generasi muda yang berkarakter, 
            terampil, dan berjiwa sosial tinggi.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            PMR Wira Unit SMKN 1 Pringgabaya merupakan organisasi kepalangmerahan tingkat Wira 
            yang diperuntukkan bagi siswa/siswi usia 15-17 tahun (kelas X dan XI). Kami hadir 
            untuk membekali anggota dengan keterampilan pertolongan pertama, siaga bencana, 
            serta nilai-nilai kemanusiaan.
          </p>
        </motion.div>

        {/* Sejarah dengan Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-pmi/5 to-maroon/5 dark:from-pmi/10 dark:to-maroon/10 rounded-xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-pmi" /> Sejarah PMR
          </h2>
          
          {/* Timeline */}
          <div className="relative border-l-4 border-pmi pl-6 ml-4 space-y-6">
            {sejarah.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-9 w-4 h-4 bg-pmi rounded-full border-4 border-white dark:border-gray-900" />
                <p className="text-sm font-bold text-pmi">{item.tahun}</p>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visi Misi */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-pmi" />
              <h2 className="text-2xl font-bold">Visi</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{visi}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-pmi" />
              <h2 className="text-2xl font-bold">Misi</h2>
            </div>
            <ul className="space-y-2">
              {misi.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-pmi font-bold">{idx + 1}.</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Tri Bakti & 7 Prinsip */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-pmi" />
              <h2 className="text-2xl font-bold">Tri Bakti PMR</h2>
            </div>
            <ul className="space-y-3">
              {triBakti.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-pmi font-bold">{idx + 1}.</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-pmi" />
              <h2 className="text-2xl font-bold">7 Prinsip Dasar</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {tujuhPrinsip.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center text-sm hover:bg-pmi hover:text-white transition-colors cursor-default"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Nilai Organisasi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-pmi to-maroon rounded-xl p-6 md:p-8 text-white mb-8"
        >
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Users className="text-white" />
            <h2 className="text-2xl font-bold text-center">Nilai Organisasi</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {nilaiOrganisasi.map((nilai, idx) => (
              <motion.span 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-white/30 transition"
              >
                {nilai}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link 
            to="/struktur-organisasi" 
            className="bg-pmi text-white px-8 py-3 rounded-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Users size={18} /> Lihat Struktur
          </Link>
          <Link 
            to="/program-kerja" 
            className="border-2 border-pmi text-pmi px-8 py-3 rounded-lg hover:bg-pmi hover:text-white transition shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Target size={18} /> Program Kerja
          </Link>
          <Link 
            to="/kegiatan" 
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            <Calendar size={18} /> Kegiatan
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;