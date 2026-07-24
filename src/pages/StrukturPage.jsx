import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, Users, UserCog, UserCheck, Shield, 
  User, UserCircle, Loader2, Clock, Info, Crown, 
  FileText, Coins, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { supabaseAdmin } from '../supabase/adminClient';

// Position Icons mapping (SAMA KAYAK SEBELUMNYA)
const positionIcons = {
  'Ketua': <Crown size={16} className="text-yellow-500" />,
  'Wakil Ketua': <UserCog size={16} className="text-blue-500" />,
  'Sekretaris': <FileText size={16} className="text-green-500" />,
  'Bendahara': <Coins size={16} className="text-amber-500" />,
  'Ketua Divisi': <Shield size={16} className="text-purple-500" />,
  'Anggota': <User size={16} className="text-gray-500" />,
};

const StrukturPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua');
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('resmi');
  const [expandedDivisions, setExpandedDivisions] = useState([]);

  useEffect(() => {
    fetchStruktur();

    const channel = supabaseAdmin
      .channel('struktur-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pengurus_resmi'
      }, () => {
        fetchStruktur();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pengurus_sementara'
      }, () => {
        fetchStruktur();
      })
      .subscribe();

    return () => supabaseAdmin.removeChannel(channel);
  }, []);

  // ========== FETCH DARI 2 TABEL ==========
  const fetchStruktur = async () => {
    setLoading(true);
    try {
      const { data: resmiData, error: resmiError } = await supabaseAdmin
        .from('pengurus_resmi')
        .select('*')
        .order('urutan', { ascending: true });

      if (resmiError) throw resmiError;

      const { data: sementaraData, error: sementaraError } = await supabaseAdmin
        .from('pengurus_sementara')
        .select('*')
        .order('urutan', { ascending: true });

      if (sementaraError) throw sementaraError;

      const resmi = (resmiData || []).map(item => ({
        ...item,
        tipe: 'resmi'
      }));

      const sementara = (sementaraData || []).map(item => ({
        ...item,
        tipe: 'sementara'
      }));

      const allData = [...resmi, ...sementara];

      const formattedData = allData.map(item => ({
        id: item.id,
        name: item.nama,
        position: item.jabatan,
        division: item.divisi || '-',
        gender: item.gender || 'male',
        photo: item.foto || null,
        tipe: item.tipe,
        keterangan: item.keterangan || '',
        urutan: item.urutan || 0,
      }));

      setMembers(formattedData);
    } catch (error) {
      console.error('Error fetching struktur:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== FILTER ==========
  const resmiMembers = members.filter(m => m.tipe === 'resmi');
  const sementaraMembers = members.filter(m => m.tipe === 'sementara');

  const allDivisions = ['Semua', ...new Set(members.map(m => m.division).filter(d => d !== '-'))];

  const getFilteredMembers = () => {
    const target = activeTab === 'resmi' ? resmiMembers : sementaraMembers;
    return target.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDivision = selectedDivision === 'Semua' || member.division === selectedDivision;
      return matchesSearch && matchesDivision;
    });
  };

  const filteredMembers = getFilteredMembers();

  // ========== GROUPING FUNCTIONS ==========
  const getGroupedByPosition = (membersList) => {
    return {
      ketua: membersList.find(m => m.position === 'Ketua'),
      wakil: membersList.find(m => m.position === 'Wakil Ketua'),
      sekretaris: membersList.filter(m => m.position === 'Sekretaris'),
      bendahara: membersList.find(m => m.position === 'Bendahara'),
      ketuaDivisi: membersList.find(m => m.position === 'Ketua Divisi'),
      anggota: membersList.filter(m => m.position === 'Anggota'),
    };
  };

  const getAnggotaByDivision = (membersList, divisi) => {
    return membersList.filter(m => m.position === 'Anggota' && m.division === divisi);
  };

  const allDivisionNames = ['Keanggotaan', 'Media', 'Perlengkapan', 'Humas', 'UKS'];

  const toggleDivision = (div) => {
    setExpandedDivisions(prev => 
      prev.includes(div) 
        ? prev.filter(d => d !== div)
        : [...prev, div]
    );
  };

  // ========== COMPONENTS ==========
  const Avatar = ({ photo, name, gender, size = 'md' }) => {
    const [hasError, setHasError] = useState(false);
    
    const sizeClasses = {
      sm: 'w-10 h-10',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
      xl: 'w-32 h-32',
    };

    if (photo && !hasError) {
      return (
        <img
          src={photo}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-lg`}
          onError={() => setHasError(true)}
        />
      );
    }

    const IconComponent = gender === 'female' ? User : UserCircle;
    const iconColor = gender === 'female' ? 'text-pink-500' : 'text-blue-500';
    const bgColor = gender === 'female' ? 'bg-pink-100' : 'bg-blue-100';

    return (
      <div className={`${sizeClasses[size]} rounded-full ${bgColor} flex items-center justify-center border-2 border-white shadow-lg`}>
        <IconComponent className={`w-1/2 h-1/2 ${iconColor}`} />
      </div>
    );
  };

  const AvatarSmall = ({ photo, name, gender }) => {
    const [hasError, setHasError] = useState(false);

    if (photo && !hasError) {
      return (
        <img
          src={photo}
          alt={name}
          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
          onError={() => setHasError(true)}
        />
      );
    }

    const IconComponent = gender === 'female' ? User : UserCircle;
    const iconColor = gender === 'female' ? 'text-pink-400' : 'text-blue-400';
    const bgColor = gender === 'female' ? 'bg-pink-50' : 'bg-blue-50';

    return (
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center border border-white shadow`}>
        <IconComponent className="w-4 h-4" style={{ color: iconColor }} />
      </div>
    );
  };

  // ========== RENDER TREE ==========
  const renderTree = (membersList, title) => {
    const grouped = getGroupedByPosition(membersList);
    const { ketua, wakil, sekretaris, bendahara, ketuaDivisi } = grouped;

    if (membersList.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Belum Ada {title}
          </h3>
          <p className="text-gray-500">Admin belum menambahkan data {title.toLowerCase()}.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
      >
        {/* Ketua */}
        {ketua && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-block">
              <div className="flex justify-center mb-3">
                <Avatar photo={ketua.photo} name={ketua.name} gender={ketua.gender} size="lg" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{ketua.name}</h3>
              <p className="text-pmi font-medium flex items-center justify-center gap-1">
                <Crown size={16} className="text-yellow-500" /> Ketua
              </p>
              {ketua.keterangan && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Info size={12} /> {ketua.keterangan}
                </p>
              )}
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
        </div>
        
        {/* Wakil Ketua */}
        {wakil && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <div className="inline-block">
              <div className="flex justify-center mb-2">
                <Avatar photo={wakil.photo} name={wakil.name} gender={wakil.gender} size="md" />
              </div>
              <h3 className="text-lg font-semibold">{wakil.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <UserCog size={14} /> Wakil Ketua
              </p>
              {wakil.keterangan && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Info size={12} /> {wakil.keterangan}
                </p>
              )}
            </div>
          </motion.div>
        )}

        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Sekretaris & Bendahara */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
          >
            <h4 className="font-semibold text-pmi mb-3 flex items-center justify-center gap-1">
              <FileText size={16} /> Sekretaris
            </h4>
            {sekretaris.map(sek => (
              <div key={sek.id} className="flex flex-col items-center gap-1 py-1">
                <div className="flex items-center gap-2">
                  <AvatarSmall photo={sek.photo} name={sek.name} gender={sek.gender} />
                  <span className="text-sm">{sek.name}</span>
                </div>
                {sek.keterangan && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info size={10} /> {sek.keterangan}
                  </p>
                )}
              </div>
            ))}
            {sekretaris.length === 0 && <p className="text-sm text-gray-400">-</p>}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
          >
            <h4 className="font-semibold text-pmi mb-3 flex items-center justify-center gap-1">
              <Coins size={16} /> Bendahara
            </h4>
            {bendahara && (
              <div className="flex flex-col items-center gap-1 py-1">
                <div className="flex items-center gap-2">
                  <AvatarSmall photo={bendahara.photo} name={bendahara.name} gender={bendahara.gender} />
                  <span className="text-sm">{bendahara.name}</span>
                </div>
                {bendahara.keterangan && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info size={10} /> {bendahara.keterangan}
                  </p>
                )}
              </div>
            )}
            {!bendahara && <p className="text-sm text-gray-400">-</p>}
          </motion.div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Ketua Divisi */}
        {ketuaDivisi && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-block">
              <div className="flex justify-center mb-2">
                <Avatar photo={ketuaDivisi.photo} name={ketuaDivisi.name} gender={ketuaDivisi.gender} size="md" />
              </div>
              <h3 className="text-lg font-semibold">{ketuaDivisi.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <Shield size={14} /> Ketua Divisi
              </p>
              {ketuaDivisi.keterangan && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Info size={12} /> {ketuaDivisi.keterangan}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Divisi Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allDivisionNames.map((div, idx) => {
            const members = getAnggotaByDivision(membersList, div);
            const isExpanded = expandedDivisions.includes(div);
            const displayedMembers = isExpanded ? members : members.slice(0, 3);
            const hasMore = members.length > 3;

            return (
              <motion.div
                key={div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition"
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDivision(div)}
                >
                  <h4 className="font-semibold text-pmi text-center border-b border-pmi/30 pb-2 flex-1">
                    {div}
                  </h4>
                  {members.length > 3 && (
                    <button className="text-gray-400 hover:text-pmi transition p-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  {members.length > 0 ? (
                    <>
                      {displayedMembers.map(member => (
                        <div key={member.id} className="flex flex-col items-center py-1.5">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                          {member.keterangan && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Info size={10} /> {member.keterangan}
                            </span>
                          )}
                        </div>
                      ))}
                      {hasMore && !isExpanded && (
                        <p className="text-xs text-center text-gray-400 mt-1">
                          +{members.length - 3} anggota lagi
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">-</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-pmi" />
        </motion.div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Struktur <span className="text-pmi">Organisasi</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pmi to-maroon mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Pengurus PMR Wira Unit SMKN 1 Pringgabaya
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Pengurus', value: members.length, color: 'text-pmi', icon: Users },
            { label: 'Pengurus Resmi', value: resmiMembers.length, color: 'text-green-500', icon: UserCheck },
            { label: 'Pengurus Sementara', value: sementaraMembers.length, color: 'text-yellow-500', icon: Clock },
            { label: 'Total Divisi', value: allDivisions.length - 1, color: 'text-blue-500', icon: Shield },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center hover:shadow-lg transition"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex gap-1 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('resmi')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'resmi'
                  ? 'bg-pmi text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Users size={18} />
              Pengurus Resmi
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {resmiMembers.length}
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('sementara')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'sementara'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Clock size={18} />
              Pengurus Sementara
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {sementaraMembers.length}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Struktur Tree */}
        {renderTree(
          activeTab === 'resmi' ? resmiMembers : sementaraMembers,
          activeTab === 'resmi' ? 'Pengurus Resmi' : 'Pengurus Sementara'
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 my-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari pengurus..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi transition"
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedDivision}
              onChange={e => setSelectedDivision(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none transition"
            >
              {allDivisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Grid */}
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold mb-6 flex items-center gap-2"
        >
          <Users size={24} className="text-pmi" />
          📋 Daftar {activeTab === 'resmi' ? 'Pengurus Resmi' : 'Pengurus Sementara'}
          <span className="text-sm font-normal text-gray-400">({filteredMembers.length})</span>
        </motion.h2>

        {filteredMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm || selectedDivision !== 'Semua' ? (
                <Search size={48} className="text-gray-400" />
              ) : (
                <Users size={48} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {searchTerm || selectedDivision !== 'Semua' ? 'Tidak Ada Pengurus Yang Cocok' : 'Belum Ada Pengurus'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedDivision !== 'Semua' 
                ? 'Coba ubah filter atau kata kunci pencarian' 
                : 'Admin belum menambahkan pengurus.'}
            </p>
            {(searchTerm || selectedDivision !== 'Semua') && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedDivision('Semua'); }}
                className="mt-4 text-pmi hover:underline font-medium"
              >
                Reset Filter
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {filteredMembers.map((member, idx) => (
                <motion.div 
                  key={member.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedMember(member)}
                  className={`cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all group border ${
                    member.tipe === 'sementara' 
                      ? 'border-yellow-400/50 hover:border-yellow-500' 
                      : 'border-gray-100 dark:border-gray-700 hover:border-pmi/50'
                  }`}
                >
                  <div className="flex justify-center mb-4 relative">
                    <Avatar photo={member.photo} name={member.name} gender={member.gender} size="md" />
                    
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-pmi transition">
                    {member.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {positionIcons[member.position] || <User size={16} className="text-gray-400" />}
                    <p className="text-pmi text-sm font-medium">{member.position}</p>
                  </div>
                  {member.division !== '-' && (
                    <span className="inline-block mt-1 text-xs bg-pmi/10 text-pmi px-2 py-0.5 rounded-full">
                      {member.division}
                    </span>
                  )}
                  
                  {member.keterangan && (
                    <div className="mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
                        <Info size={12} className="text-pmi" />
                        <span className="line-clamp-1">{member.keterangan}</span>
                      </p>
                    </div>
                  )}

                  {member.tipe === 'sementara' && (
                    <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                      ⏳ Sementara
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <Avatar photo={selectedMember.photo} name={selectedMember.name} gender={selectedMember.gender} size="xl" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                {positionIcons[selectedMember.position] || <User size={16} className="text-gray-400" />}
                <p className="text-pmi font-semibold">{selectedMember.position}</p>
              </div>
              {selectedMember.division !== '-' && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  Divisi {selectedMember.division}
                </p>
              )}
              
              {selectedMember.keterangan && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                    <Info size={14} className="text-pmi" />
                    {selectedMember.keterangan}
                  </p>
                </div>
              )}

              {selectedMember.tipe === 'sementara' && (
                <span className="inline-block mb-2 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full">
                  ⏳ Pengurus Sementara
                </span>
              )}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMember(null)} 
                className="mt-4 bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Tutup
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrukturPage;