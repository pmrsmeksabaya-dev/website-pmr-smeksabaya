const AdminBerita = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Berita</h1>
        <button className="bg-pmi text-white px-4 py-2 rounded-lg">+ Tambah Berita</button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-500">Form berita akan muncul di sini</div>
    </div>
  );
};

export default AdminBerita;