import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Users, Calendar, Award, ArrowRight } from 'lucide-react';
import logoPmr from '../assets/pmr.png';

const HomePage = () => {
  const stats = [
    { icon: Users, value: '30+', label: 'Anggota Aktif' },
    { icon: Heart, value: '8+', label: 'Program Kerja' },
    { icon: Calendar, value: '4', label: 'Kegiatan Tahunan' },
    { icon: Award, value: '1', label: 'Prestasi' },
  ];

  const programs = [
    { title: 'Siaga Bencana', desc: 'Pelatihan tanggap darurat dan evakuasi' },
    { title: 'Donor Darah', desc: 'Kerjasama dengan PMI untuk donor darah rutin' },
    { title: 'UKS Sekolah', desc: 'Pengelolaan Unit Kesehatan Sekolah' },
    { title: 'P3K', desc: 'Pelatihan Pertolongan Pertama Pada Kecelakaan' },
  ];

  const kegiatan = [
    { title: 'Latihan Rutin PMR', date: 'Setiap Sabtu', img: 'https://picsum.photos/400/250?random=1' },
    { title: 'Bakti Sosial', date: 'Bulan Ramadhan', img: 'https://picsum.photos/400/250?random=2' },
    { title: 'Simulasi Bencana', date: 'Semester Genap', img: 'https://picsum.photos/400/250?random=3' },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section - CUMA PMR, TANPA BLUR MERAH */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-white dark:via-gray-900 dark:to-gray-900"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left"
            >
              
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                <span className="text-pmi">PMR WIRA</span>
                <br />
                SMKN 1 PRINGGABAYA
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                Organisasi Kepalangmerahan yang membentuk generasi muda berjiwa kemanusiaan
              </p>
              <p className="text-xl md:text-2xl font-semibold text-maroon dark:text-gold mb-8">
                "Siap Menolong Sesama Dengan Tulus dan Ikhlas"
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/pendaftaran" className="bg-pmi text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-lg hover:shadow-xl">
                  Daftar Anggota
                </Link>
                <Link to="/kegiatan" className="border-2 border-pmi text-pmi px-6 py-3 rounded-lg font-semibold hover:bg-pmi hover:text-white transition">
                  Lihat Kegiatan
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex justify-center"
            >
              {/* Hero Logo - PMR SAJA, TANPA BLUR MERAH */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white rounded-3xl -z-10"></div>
                <div className="relative p-6 md:p-8 lg:p-10 bg-white/95 backdrop-blur-sm border border-gray-100/80 rounded-[32px] md:rounded-[40px] shadow-premium-lg hover:shadow-premium-hover transition-all duration-500 hover:transform hover:-translate-y-1">
                  <img 
                    src={logoPmr} 
                    alt="PMR Hero" 
                    className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain transition-all duration-500 hover:scale-105"
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.08))'
                    }}
                  />
                  <div className="text-center mt-4">
                    <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
                      PMR WIRA
                    </h2>
                    <p className="text-sm text-gray-500">SMKN 1 Pringgabaya</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest tetap sama */}
      <Section id="tentang">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Tentang <span className="text-pmi">PMR Wira</span></h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
          Palang Merah Remaja (PMR) adalah wadah pembinaan dan pengembangan anggota remaja PMI yang bertujuan membentuk generasi muda yang berkarakter, terampil, dan berjiwa sosial tinggi.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} icon={stat.icon} value={stat.value} label={stat.label} />
          ))}
        </div>
      </Section>

      <Section bg="gray">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Program <span className="text-pmi">Unggulan</span></h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Program kerja unggulan PMR Wira SMKN 1 Pringgabaya dalam membangun generasi tanggap bencana
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog, idx) => (
            <ProgramCard key={idx} title={prog.title} desc={prog.desc} />
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Kegiatan <span className="text-pmi">Terbaru</span></h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {kegiatan.map((item, idx) => (
            <ActivityCard key={idx} title={item.title} date={item.date} img={item.img} />
          ))}
        </div>
        <div className="text-center">
          <Link to="/kegiatan" className="inline-flex items-center gap-2 text-pmi font-semibold hover:gap-3 transition-all">
            Lihat Semua Kegiatan <ArrowRight size={18} />
          </Link>
        </div>
      </Section>

      <CTASection />
    </div>
  );
};

// Components tetap sama
const Section = ({ children, bg, id }) => (
  <section id={id} className={`py-16 md:py-20 ${bg === 'gray' ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
    <div className="container-custom">{children}</div>
  </section>
);

const StatCard = ({ icon: Icon, value, label }) => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (inView) {
      let targetNumber = 0;
      let suffix = '';
      
      if (typeof value === 'string') {
        const match = value.match(/^(\d+)(.*)$/);
        if (match) {
          targetNumber = parseInt(match[1], 10);
          suffix = match[2];
        } else {
          setDisplayValue(value);
          return;
        }
      } else if (typeof value === 'number') {
        targetNumber = value;
      }
      
      if (targetNumber > 0) {
        const duration = 2000;
        const step = targetNumber / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= targetNumber) {
            setDisplayValue(targetNumber + suffix);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.floor(current) + suffix);
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition group">
      <div className="w-14 h-14 bg-pmi/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pmi transition">
        <Icon className="w-7 h-7 text-pmi group-hover:text-white transition" />
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{displayValue}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    </div>
  );
};

const ProgramCard = ({ title, desc }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition group">
    <div className="w-12 h-12 bg-pmi/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pmi transition">
      <Heart className="w-6 h-6 text-pmi group-hover:text-white transition" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{desc}</p>
  </div>
);

const ActivityCard = ({ title, date, img }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
    <img src={img} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-pmi text-sm">{date}</p>
    </div>
  </div>
);

const CTASection = () => (
  <section className="py-16 bg-gradient-to-r from-pmi to-maroon">
    <div className="container-custom text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bergabung Menjadi Anggota PMR</h2>
      <p className="text-white/90 mb-8 max-w-2xl mx-auto">
        Jadilah bagian dari generasi muda yang siap menolong sesama dengan tulus dan ikhlas
      </p>
      <a
        href="https://pmrsmeksabaya-daftar.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-pmi px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
      >
        Daftar Sekarang
      </a>
    </div>
  </section>
);

export default HomePage;