import { useState } from 'react';
import { Search, Filter, X, Mail, Phone } from 'lucide-react';

const strukturData = {
  ketua: { name: 'Nadia Amanda Sari', position: 'Ketua', division: 'Ketua', image: 'https://via.placeholder.com/200' },
  wakil: { name: 'Yudha Akhira', position: 'Wakil Ketua', division: 'Wakil Ketua', image: 'https://via.placeholder.com/200' },
  sekretaris: [
    { name: 'Zuhratul Hasanah', position: 'Sekretaris', division: 'Sekretaris', image: 'https://via.placeholder.com/200' },
    { name: 'Safa Safira', position: 'Sekretaris', division: 'Sekretaris', image: 'https://via.placeholder.com/200' },
  ],
  bendahara: { name: 'Saskia Riyanti', position: 'Bendahara', division: 'Bendahara', image: 'https://via.placeholder.com/200' },
  ketuaDivisi: { name: 'Hesta Wardani', position: 'Ketua Divisi', division: 'Divisi', image: 'https://via.placeholder.com/200' },
  divisiKeanggotaan: [
    { name: 'Tuti Lestari', position: 'Anggota', division: 'Keanggotaan', image: 'https://via.placeholder.com/200' },
    { name: 'Umar Mujahid Hafidz Zhulloh', position: 'Anggota', division: 'Keanggotaan', image: 'https://via.placeholder.com/200' },
  ],
  divisiMedia: [
    { name: 'Nia Asmalika', position: 'Anggota', division: 'Media', image: 'https://via.placeholder.com/200' },
    { name: 'Siti Rauhun', position: 'Anggota', division: 'Media', image: 'https://via.placeholder.com/200' },
  ],
  divisiPerlengkapan: [
    { name: 'M. Ajwa', position: 'Anggota', division: 'Perlengkapan', image: 'https://via.placeholder.com/200' },
    { name: 'Saepudin Amsir', position: 'Anggota', division: 'Perlengkapan', image: 'https://via.placeholder.com/200' },
  ],
  divisiHumas: [
    { name: 'Nur Fadila', position: 'Anggota', division: 'Humas', image: 'https://via.placeholder.com/200' },
    { name: 'Olipia Zuliatul Fitri', position: 'Anggota', division: 'Humas', image: 'https://via.placeholder.com/200' },
  ],
  divisiUKS: [{ name: 'Cici Rezilda Putri', position: 'Anggota', division: 'UKS', image: 'https://via.placeholder.com/200' }],
};

const allMembers = [
  strukturData.ketua,
  strukturData.wakil,
  ...strukturData.sekretaris,
  strukturData.bendahara,
  strukturData.ketuaDivisi,
  ...strukturData.divisiKeanggotaan,
  ...strukturData.divisiMedia,
  ...strukturData.divisiPerlengkapan,
  ...strukturData.divisiHumas,
  ...strukturData.divisiUKS,
];

const divisions = ['Semua', 'Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Divisi', 'Keanggotaan', 'Media', 'Perlengkapan', 'Humas', 'UKS'];

const StrukturPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua');
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = selectedDivision === 'Semua' || member.division === selectedDivision;
    return matchesSearch && matchesDivision;
  });

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Struktur <span className="text-pmi">Organisasi</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Pengurus PMR Wira Unit SMKN 1 Pringgabaya periode aktif
        </p>

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
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedDivision}
              onChange={e => setSelectedDivision(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pmi appearance-none"
            >
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Struktur Chart */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-pmi to-maroon rounded-2xl text-white">
              <h3 className="text-xl font-bold">{strukturData.ketua.name}</h3>
              <p>{strukturData.ketua.position}</p>
            </div>
            <div className="relative h-16 mx-auto w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="inline-block p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <h3 className="font-semibold">{strukturData.wakil.name}</h3>
              <p className="text-sm">{strukturData.wakil.position}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <h3 className="font-semibold text-pmi">Sekretaris</h3>
              {strukturData.sekretaris.map(sek => (
                <p key={sek.name}>{sek.name}</p>
              ))}
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <h3 className="font-semibold text-pmi">Bendahara</h3>
              <p>{strukturData.bendahara.name}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <h3 className="font-semibold">{strukturData.ketuaDivisi.name}</h3>
              <p className="text-sm">{strukturData.ketuaDivisi.position}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DivisionCard title="Divisi Keanggotaan" members={strukturData.divisiKeanggotaan} />
            <DivisionCard title="Divisi Media" members={strukturData.divisiMedia} />
            <DivisionCard title="Divisi Perlengkapan" members={strukturData.divisiPerlengkapan} />
            <DivisionCard title="Divisi Humas" members={strukturData.divisiHumas} />
            <DivisionCard title="Divisi UKS" members={strukturData.divisiUKS} />
          </div>
        </div>

        {/* Members Grid */}
        <h2 className="text-2xl font-bold mb-6">Daftar Pengurus</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, idx) => (
            <MemberCard key={idx} member={member} onClick={() => setSelectedMember(member)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMember(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedMember.name}</h3>
              <button onClick={() => setSelectedMember(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-4 mb-4">
              <img src={selectedMember.image} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover" />
              <div>
                <p className="text-pmi font-semibold">{selectedMember.position}</p>
                <p className="text-gray-600 dark:text-gray-400">Divisi: {selectedMember.division}</p>
              </div>
            </div>
            <div className="border-t dark:border-gray-700 pt-4">
              <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={16} /> Kontak akan diinformasikan lebih lanjut
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DivisionCard = ({ title, members }) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
    <h4 className="font-semibold text-pmi mb-3">{title}</h4>
    {members.map(member => (
      <p key={member.name} className="text-sm py-1">{member.name}</p>
    ))}
  </div>
);

const MemberCard = ({ member, onClick }) => (
  <div onClick={onClick} className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition group">
    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-pmi to-maroon p-0.5">
      <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
    </div>
    <h3 className="font-semibold text-lg">{member.name}</h3>
    <p className="text-pmi text-sm mb-1">{member.position}</p>
    <p className="text-gray-500 dark:text-gray-400 text-xs">Divisi {member.division}</p>
  </div>
);

export default StrukturPage;