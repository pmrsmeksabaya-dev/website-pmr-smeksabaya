import { Link } from 'react-router-dom';
import { CheckCircle, FileText, Users, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

const PendaftaranPage = () => {
  const requirements = [
    'Siswa/i aktif SMKN 1 Pringgabaya',
    'Kelas X, XI, atau XII',
    'Memiliki izin orang tua',
    'Bersedia mengikuti seluruh kegiatan PMR',
    'Sehat jasmani dan rohani',
    'Memiliki komitmen tinggi terhadap kemanusiaan',
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
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Pendaftaran <span className="text-pmi">Anggota PMR</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bergabunglah menjadi anggota PMR Wira Unit SMKN 1 Pringgabaya dan jadilah generasi tanggap bencana
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Syarat */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-pmi" />
              <h2 className="text-2xl font-bold">Syarat Pendaftaran</h2>
            </div>
            <ul className="space-y-3">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Keuntungan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-pmi" />
              <h2 className="text-2xl font-bold">Keuntungan Bergabung</h2>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-pmi mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-r from-pmi/10 to-maroon/10 dark:from-pmi/20 dark:to-maroon/20 rounded-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Calendar className="w-8 h-8 text-pmi" />
            <h2 className="text-2xl font-bold">Periode Pendaftaran</h2>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
            Pendaftaran dibuka sepanjang tahun ajaran. Gelombang pendaftaran utama:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 text-center">
              <p className="font-semibold">Gelombang 1</p>
              <p>Juli - Agustus</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 text-center">
              <p className="font-semibold">Gelombang 2</p>
              <p>November - Desember</p>
            </div>
          </div>
        </div>

        {/* CTA Button - Arahkan ke halaman redirect */}
        <div className="text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 flex items-center gap-3 justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              Sistem pendaftaran sedang dalam perbaikan
            </p>
          </div>
          <Link
            to="/pendaftaran-redirect"
            className="inline-flex items-center gap-2 bg-pmi text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl"
          >
            Info Pendaftaran <ArrowRight size={20} />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Klik tombol di atas untuk melihat informasi pendaftaran sementara
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendaftaranPage;