export const publicRoutes = [
  { path: '/', component: 'HomePage' },
  { path: '/profil', component: 'ProfilePage' },
  { path: '/struktur-organisasi', component: 'StrukturPage' },
  { path: '/program-kerja', component: 'ProgramPage' },
  { path: '/kegiatan', component: 'KegiatanPage' },
  { path: '/galeri', component: 'GaleriPage' },
  { path: '/pendaftaran', component: 'PendaftaranPage' },
  { path: '/kontak', component: 'KontakPage' },
];

export const adminRoutes = [
  { path: '/admin/login', component: 'AdminLogin' },
  { path: '/admin/dashboard', component: 'AdminDashboard' },
  { path: '/admin/struktur', component: 'AdminStruktur' },
  { path: '/admin/program', component: 'AdminProgram' },
  { path: '/admin/berita', component: 'AdminBerita' },
  { path: '/admin/galeri', component: 'AdminGaleri' },
  { path: '/admin/settings', component: 'AdminSettings' },
];