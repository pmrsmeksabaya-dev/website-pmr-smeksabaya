import { Heart, Target, Eye, BookOpen, Shield, Users } from 'lucide-react';

const ProfilePage = () => {
  const visi = " Mewujudkan PMR SMKN 1 Pringgabaya sebagai organisasi yang aktif, disiplin, profesional, dan berjiwa kemanusiaan, serta mampu menjadi teladan dalam kepedulian, kesiapsiagaan, dan kerja sama di lingkungan sekolah maupun masyarakat.";
  
  const misi = [
    "Meningkatkan kedisiplinan dan rasa tanggung jawab anggota PMR Dengan membangun ke aktifan dalam kegiatan, tepat waktu, dan komitmen terhadap tugas.",
    "Mengembangkan keterampilan dan kemampuan anggota PMR melalui latihan rutin, simulasi, dan kegiatan kepalangmerahan agar setiap anggota siap bertindak dalam situasi darurat.",
    "Memperkuat rasa kebersamaan dan kekompakan antaranggota Dengan menciptakan suasana organisasi yang saling menghargai, mendukung, menghormati, dan bekerja sama sebagai satu tim.",
    "Mengaktifkan peran PMR dalam kegiatan sekolah dan sosial Supaya PMR tidak hanya hadir sebagai organisasi, tetapi juga sebagai garda kemanusiaan di lingkungan sekolah dan masyarakat.",
    "Meningkatkan citra dan kepercayaan terhadap PMR Dengan menunjukkan sikap profesional, sopan, dan siap membantu siapa pun yang membutuhkan.",
    "Mendorong anggota agar lebih percaya diri dan berani berperan Baik dalam kepemimpinan, komunikasi, maupun dalam setiap kegiatan PMR.",
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

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Profil <span className="text-pmi">PMR Wira</span>
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Palang Merah Remaja Wira Unit SMKN 1 Pringgabaya
        </p>

        {/* Tentang PMR */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg mb-8">
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
        </div>

        {/* Sejarah */}
        <div className="bg-gradient-to-r from-pmi/5 to-maroon/5 dark:from-pmi/10 dark:to-maroon/10 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Sejarah PMR</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Palang Merah Remaja (PMR) secara resmi berdiri di Indonesia
            pada 1 Maret 1950 sebagai wadah pembinaan generasi 
            muda di bawah naungan Palang Merah Indonesia (PMI). 
            PMR memiliki tiga tingkatan, yaitu PMR Mula (SD/sederajat),
            PMR Madya (SMP/sederajat), dan PMR Wira (SMA/SMK/sederajat).
            PMR berperan dalam membentuk remaja yang berkarakter, peduli sesama, tanggap bencana, 
            serta menjunjung tinggi nilai-nilai kemanusiaan sesuai Prinsip Dasar Gerakan Palang Merah dan Bulan Sabit Merah Internasional.
          </p>
        </div>

        {/* Visi Misi */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-pmi" />
              <h2 className="text-2xl font-bold">Visi</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{visi}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-pmi" />
              <h2 className="text-2xl font-bold">Misi</h2>
            </div>
            <ul className="space-y-2">
              {misi.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-pmi">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tri Bakti & 7 Prinsip */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
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
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-pmi" />
              <h2 className="text-2xl font-bold">7 Prinsip Dasar</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {tujuhPrinsip.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 text-center text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nilai Organisasi */}
        <div className="bg-gradient-to-r from-pmi to-maroon rounded-xl p-6 md:p-8 text-white">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Users className="text-white" />
            <h2 className="text-2xl font-bold text-center">Nilai Organisasi</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {nilaiOrganisasi.map((nilai, idx) => (
              <span key={idx} className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {nilai}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;