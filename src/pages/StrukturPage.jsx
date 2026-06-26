import { useState, useEffect } from 'react';
import { Search, Filter, X, Users, UserCog, UserCheck, Shield, User, UserCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';

const StrukturPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua');
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch data dari Supabase
  useEffect(() => {
    fetchStruktur();
  }, []);

  const fetchStruktur = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .select('*')
        .order('urutan', { ascending: true });

      if (error) throw error;
      
      // Map data ke format yang sesuai
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.nama,
        position: item.jabatan,
        division: item.divisi || '-',
        gender: item.gender || 'male',
        photo: item.foto || null,
      }));

      setMembers(formattedData);
    } catch (error) {
      console.error('Error fetching struktur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil divisi unik untuk filter
  const divisions = ['Semua', ...new Set(members.map(m => m.division).filter(d => d !== '-'))];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = selectedDivision === 'Semua' || member.division === selectedDivision;
    return matchesSearch && matchesDivision;
  });

  // Group members by position for visual tree
  const ketua = members.find(m => m.position === 'Ketua');
  const wakil = members.find(m => m.position === 'Wakil Ketua');
  const sekretaris = members.filter(m => m.position === 'Sekretaris');
  const bendahara = members.find(m => m.position === 'Bendahara');
  const ketuaDivisi = members.find(m => m.position === 'Ketua Divisi');
  const anggota = members.filter(m => m.position === 'Anggota');

  // Group anggota by division
  const getAnggotaByDivision = (divisi) => {
    return anggota.filter(m => m.division === divisi);
  };

  const allDivisions = ['Keanggotaan', 'Media', 'Perlengkapan', 'Humas', 'UKS'];

  // Avatar Component
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

  if (loading) {
    return (
      <div className="pt-32 pb-16 flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-pmi animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Struktur <span className="text-pmi">Organisasi</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Pengurus PMR Wira Unit SMKN 1 Pringgabaya periode aktif
        </p>

        {/* Struktur Chart - Visual Tree */}
        {members.length > 0 && (
          <div className="mb-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            {/* Ketua */}
            {ketua && (
              <div className="text-center mb-6">
                <div className="inline-block">
                  <div className="flex justify-center mb-3">
                    <Avatar photo={ketua.photo} name={ketua.name} gender={ketua.gender} size="lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{ketua.name}</h3>
                  <p className="text-pmi font-medium">Ketua</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mb-6">
              <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
            </div>
            
            {/* Wakil Ketua */}
            {wakil && (
              <div className="text-center mb-6">
                <div className="inline-block">
                  <div className="flex justify-center mb-2">
                    <Avatar photo={wakil.photo} name={wakil.name} gender={wakil.gender} size="md" />
                  </div>
                  <h3 className="text-lg font-semibold">{wakil.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wakil Ketua</p>
                </div>
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Sekretaris & Bendahara */}
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
              <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-pmi mb-3">Sekretaris</h4>
                {sekretaris.map(sek => (
                  <div key={sek.id} className="flex items-center justify-center gap-2 py-1">
                    <AvatarSmall photo={sek.photo} name={sek.name} gender={sek.gender} />
                    <span className="text-sm">{sek.name}</span>
                  </div>
                ))}
                {sekretaris.length === 0 && (
                  <p className="text-sm text-gray-400">-</p>
                )}
              </div>
              <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-pmi mb-3">Bendahara</h4>
                {bendahara && (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <AvatarSmall photo={bendahara.photo} name={bendahara.name} gender={bendahara.gender} />
                    <span className="text-sm">{bendahara.name}</span>
                  </div>
                )}
                {!bendahara && <p className="text-sm text-gray-400">-</p>}
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Ketua Divisi */}
            {ketuaDivisi && (
              <div className="text-center mb-8">
                <div className="inline-block">
                  <div className="flex justify-center mb-2">
                    <Avatar photo={ketuaDivisi.photo} name={ketuaDivisi.name} gender={ketuaDivisi.gender} size="md" />
                  </div>
                  <h3 className="text-lg font-semibold">{ketuaDivisi.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ketua Divisi</p>
                </div>
              </div>
            )}

            {/* Divisi Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {allDivisions.map(div => {
                const members = getAnggotaByDivision(div);
                return (
                  <DivisionCard key={div} title={`Divisi ${div}`} members={members} />
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari pengurus..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi"
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedDivision}
              onChange={e => setSelectedDivision(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Grid */}
        <h2 className="text-2xl font-bold mb-6">📋 Daftar Seluruh Pengurus</h2>
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Users size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Belum ada pengurus yang ditambahkan</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMembers.map((member) => (
              <div 
                key={member.id} 
                onClick={() => setSelectedMember(member)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group border border-gray-100 dark:border-gray-700 hover:border-pmi/50"
              >
                <div className="flex justify-center mb-4">
                  <Avatar photo={member.photo} name={member.name} gender={member.gender} size="md" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-pmi transition">{member.name}</h3>
                <p className="text-pmi text-sm font-medium mt-1">{member.position}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {member.division !== '-' ? `Divisi ${member.division}` : member.division}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMember(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <Avatar photo={selectedMember.photo} name={selectedMember.name} gender={selectedMember.gender} size="xl" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
            <p className="text-pmi font-semibold mb-2">{selectedMember.position}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{selectedMember.division}</p>
            <button onClick={() => setSelectedMember(null)} className="bg-pmi text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Division Card Component
const DivisionCard = ({ title, members }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition">
    <h4 className="font-semibold text-pmi mb-3 text-center border-b border-pmi/30 pb-2">{title}</h4>
    {members.length > 0 ? (
      members.map(member => (
        <div key={member.id} className="flex items-center justify-center gap-2 py-1.5">
          <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 text-center">-</p>
    )}
  </div>
);

export default StrukturPage;