import { useState } from 'react';
import { Image, PlusCircle } from 'lucide-react';

const GaleriPage = () => {
  // KOSONGKAN DULU - nanti diisi admin
  const albums = [];

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Galeri <span className="text-pmi">Kegiatan</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Dokumentasi kegiatan PMR Wira SMKN 1 Pringgabaya</p>

        {/* Empty State */}
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <Image size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Belum Ada Galeri</h3>
          <p className="text-gray-500">Foto dan video kegiatan akan segera diupload oleh admin.</p>
          <p className="text-gray-400 text-sm mt-2">Silakan cek kembali nanti!</p>
        </div>
      </div>
    </div>
  );
};

export default GaleriPage;