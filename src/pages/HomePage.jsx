import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Heart, Users, Calendar, Award, ArrowRight, 
  Droplet, Loader2, Sparkles, Shield, Zap 
} from 'lucide-react';
import { useKegiatan } from '../hooks/useKegiatan';
import { LazyImage } from '../components/LazyImage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ActivitySkeleton, StatSkeleton } from '../components/Skeleton';
import logoPmr from '../assets/pmr.png';
import CTASection from '../components/CTASection';

// Constants
const STATS = [
  { icon: Users, value: '30+', label: 'Anggota Aktif', color: 'blue' },
  { icon: Heart, value: '8+', label: 'Program Kerja', color: 'red' },
  { icon: Calendar, value: '4', label: 'Kegiatan Tahunan', color: 'green' },
  { icon: Award, value: '1', label: 'Prestasi', color: 'yellow' },
];

const PROGRAMS = [
  { 
    title: 'Siaga Bencana', 
    desc: 'Pelatihan tanggap darurat dan evakuasi',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-400'
  },
  { 
    title: 'Donor Darah', 
    desc: 'Kerjasama dengan PMI untuk donor darah rutin',
    icon: Droplet,
    gradient: 'from-red-500 to-rose-400'
  },
  { 
    title: 'UKS Sekolah', 
    desc: 'Pengelolaan Unit Kesehatan Sekolah',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-400'
  },
  { 
    title: 'P3K', 
    desc: 'Pelatihan Pertolongan Pertama Pada Kecelakaan',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-400'
  },
];

const HomePage = () => {
  const { data: kegiatan, loading: loadingKegiatan, error, refetch } = useKegiatan(3);
  const [statsInView, setStatsInView] = useState(false);

  // Track analytics
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Home',
        page_location: window.location.href,
      });
    }
  }, []);

  // Handle error
  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">🔥 Gagal memuat data</p>
          <button 
            onClick={refetch}
            className="bg-pmi text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Tentang PMR */}
        <Section id="tentang" bg="white">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tentang <span className="text-pmi">PMR Wira</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto mb-6 rounded-full" />
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
                Palang Merah Remaja (PMR) adalah wadah pembinaan dan pengembangan anggota remaja PMI 
                yang bertujuan membentuk generasi muda yang berkarakter, terampil, dan berjiwa sosial tinggi.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => (
                <StatCard 
                  key={idx} 
                  icon={stat.icon} 
                  value={stat.value} 
                  label={stat.label}
                  color={stat.color}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Program Unggulan */}
        <Section bg="gray" id="program">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Program <span className="text-pmi">Unggulan</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto mt-4 rounded-full" />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
              Program kerja unggulan PMR Wira SMKN 1 Pringgabaya dalam membangun generasi tanggap bencana
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((prog, idx) => (
              <ProgramCard 
                key={idx} 
                title={prog.title} 
                desc={prog.desc}
                icon={prog.icon}
                gradient={prog.gradient}
                index={idx}
              />
            ))}
          </div>
        </Section>

        {/* Kegiatan Terbaru */}
        <Section bg="white" id="kegiatan">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Kegiatan <span className="text-pmi">Terbaru</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto mt-4 rounded-full" />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
              Update kegiatan terbaru dari PMR Wira SMKN 1 Pringgabaya
            </p>
          </motion.div>

          {loadingKegiatan ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <ActivitySkeleton key={i} />)}
            </div>
          ) : kegiatan.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
            >
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Belum Ada Kegiatan
              </h3>
              <p className="text-gray-500">Pantau terus website ini untuk update terbaru</p>
            </motion.div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {kegiatan.map((item, idx) => (
                  <ActivityCard 
                    key={item.id} 
                    title={item.judul} 
                    date={item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : 'TBA'}
                    img={item.thumbnail || `https://picsum.photos/seed/${item.id}/400/250`}
                    isDonor={item.judul?.toLowerCase().includes('donor darah')}
                    index={idx}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  to="/kegiatan" 
                  className="inline-flex items-center gap-2 text-pmi font-semibold hover:gap-3 transition-all group"
                >
                  Lihat Semua Kegiatan 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </Section>

        {/* CTA Pendaftaran */}
        <Suspense fallback={
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 text-pmi animate-spin" />
          </div>
        }>
          <CTASection />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

// ============= SUB COMPONENTS =============

const HeroSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background dengan gradient dan pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-white dark:via-gray-900 dark:to-gray-900" />
      <div className="absolute inset-0 opacity-5 bg-[url('/pattern.svg')] bg-repeat" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="flex-1 text-center lg:text-left"
          >
            
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <span className="text-pmi">PMR WIRA</span>
              <br />
              SMKN 1 PRINGGABAYA
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Organisasi Kepalangmerahan yang membentuk generasi muda berjiwa kemanusiaan
            </motion.p>
            
            <motion.p 
              className="text-xl md:text-2xl font-semibold text-maroon dark:text-gold mb-8 flex items-center gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Sparkles size={24} className="text-pmi" />
              "Siap Menolong Sesama Dengan Tulus dan Ikhlas"
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/pendaftaran" 
                className="bg-pmi text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              >
                Daftar Anggota
              </Link>
              <Link 
                to="/kegiatan" 
                className="border-2 border-pmi text-pmi px-8 py-3 rounded-lg font-semibold hover:bg-pmi hover:text-white transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              >
                Lihat Kegiatan
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="flex-1 flex justify-center"
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white rounded-3xl -z-10" />
              <div className="relative p-6 md:p-8 lg:p-10 bg-white/95 backdrop-blur-sm border border-gray-100/80 rounded-[32px] md:rounded-[40px] shadow-premium-lg">
                <img 
                  src={logoPmr} 
                  alt="PMR Hero" 
                  className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
                  style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.08))' }}
                />
                <div className="text-center mt-4">
                  <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
                    PMR WIRA
                  </h2>
                  <p className="text-sm text-gray-500">SMKN 1 Pringgabaya</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Section = ({ children, bg, id }) => (
  <section id={id} className={`py-16 md:py-20 ${bg === 'gray' ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'}`}>
    <div className="container-custom">{children}</div>
  </section>
);

const StatCard = ({ icon: Icon, value, label, color, index }) => {
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

  const colorMap = {
    blue: 'bg-blue-500/10 group-hover:bg-blue-500',
    red: 'bg-red-500/10 group-hover:bg-red-500',
    green: 'bg-green-500/10 group-hover:bg-green-500',
    yellow: 'bg-yellow-500/10 group-hover:bg-yellow-500',
  };

  const textColorMap = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
    >
      <div className={`w-14 h-14 ${colorMap[color]} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300`}>
        <Icon className={`w-7 h-7 ${textColorMap[color]} group-hover:text-white transition-all duration-300`} />
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{displayValue}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
};

const ProgramCard = ({ title, desc, icon: Icon, gradient, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
    <div className="relative">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-pmi group-hover:text-maroon transition-colors" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-pmi transition-colors">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  </motion.div>
);

const ActivityCard = ({ title, date, img, isDonor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8 }}
    className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
    <div className="relative overflow-hidden">
      <LazyImage 
        src={img} 
        alt={title} 
        className="w-full h-48"
        fallback="https://picsum.photos/seed/fallback/400/250"
      />
      {isDonor && (
        <motion.div 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="absolute top-3 left-3"
        >
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg animate-pulse">
            <Droplet size={12} /> Donor Darah
          </span>
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 group-hover:text-pmi transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-pmi text-sm flex items-center gap-1">
        <Calendar size={14} /> {date}
      </p>
    </div>
  </motion.div>
);


export default HomePage;