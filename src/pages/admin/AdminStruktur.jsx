import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminStruktur = () => {
  const [search, setSearch] = useState('');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Struktur Organisasi</h1>
        <button className="bg-pmi text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition">
          <Plus size={20} /> Tambah Pengurus
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Cari pengurus..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Jabatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Divisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4">Nadia Amanda Sari</td>
                <td className="px-6 py-4">Ketua</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                  <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStruktur;