import { lazy } from 'react';

// ========== PUBLIC PAGES (LAZY LOAD) ==========
const HomePage = lazy(() => import('../pages/HomePage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const StrukturPage = lazy(() => import('../pages/StrukturPage'));
const ProgramPage = lazy(() => import('../pages/ProgramPage'));
const KegiatanPage = lazy(() => import('../pages/KegiatanPage'));
const GaleriPage = lazy(() => import('../pages/GaleriPage'));
const PendaftaranPage = lazy(() => import('../pages/PendaftaranPage'));
const KontakPage = lazy(() => import('../pages/KontakPage'));
const PendaftaranRedirect = lazy(() => import('../pages/PendaftaranRedirect'));

// ========== ADMIN PAGES (LAZY LOAD) ==========
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminStruktur = lazy(() => import('../pages/admin/AdminStruktur'));
const AdminProgram = lazy(() => import('../pages/admin/AdminProgram'));
const AdminKegiatan = lazy(() => import('../pages/admin/AdminKegiatan'));
const AdminGaleri = lazy(() => import('../pages/admin/AdminGaleri'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const ForgotPassword = lazy(() => import('../pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/admin/ResetPassword'));

// ========== ROUTE META DATA ==========
export const routeMeta = {
  '/': { title: 'Beranda - PMR Wira', description: 'Selamat datang di PMR Wira SMKN 1 Pringgabaya' },
  '/profil': { title: 'Profil - PMR Wira', description: 'Profil PMR Wira SMKN 1 Pringgabaya' },
  '/struktur-organisasi': { title: 'Struktur - PMR Wira', description: 'Struktur organisasi PMR Wira' },
  '/program-kerja': { title: 'Program Kerja - PMR Wira', description: 'Program kerja PMR Wira' },
  '/kegiatan': { title: 'Kegiatan - PMR Wira', description: 'Kegiatan PMR Wira' },
  '/galeri': { title: 'Galeri - PMR Wira', description: 'Galeri PMR Wira' },
  '/pendaftaran': { title: 'Pendaftaran - PMR Wira', description: 'Pendaftaran PMR Wira' },
  '/kontak': { title: 'Kontak - PMR Wira', description: 'Kontak PMR Wira' },
  '/pendaftaran-redirect': { title: 'Pendaftaran - PMR Wira', description: 'Pendaftaran PMR Wira' },
  '/admin/login': { title: 'Login Admin - PMR Wira', description: 'Login admin PMR Wira' },
  '/admin/forgot-password': { title: 'Lupa Password - PMR Wira', description: 'Reset password admin' },
  '/admin/reset-password': { title: 'Reset Password - PMR Wira', description: 'Reset password admin' },
  '/admin': { title: 'Dashboard Admin - PMR Wira', description: 'Dashboard admin PMR Wira' },
  '/admin/struktur': { title: 'Struktur - Admin PMR Wira', description: 'Kelola struktur PMR Wira' },
  '/admin/program': { title: 'Program - Admin PMR Wira', description: 'Kelola program PMR Wira' },
  '/admin/kegiatan': { title: 'Kegiatan - Admin PMR Wira', description: 'Kelola kegiatan PMR Wira' },
  '/admin/galeri': { title: 'Galeri - Admin PMR Wira', description: 'Kelola galeri PMR Wira' },
  '/admin/settings': { title: 'Pengaturan - Admin PMR Wira', description: 'Pengaturan website PMR Wira' },
};

// ========== PUBLIC ROUTES ==========
export const publicRoutes = [
  { 
    path: '/', 
    component: HomePage,
    title: 'Beranda',
    exact: true,
  },
  { 
    path: '/profil', 
    component: ProfilePage,
    title: 'Profil',
  },
  { 
    path: '/struktur-organisasi', 
    component: StrukturPage,
    title: 'Struktur',
  },
  { 
    path: '/program-kerja', 
    component: ProgramPage,
    title: 'Program Kerja',
  },
  { 
    path: '/kegiatan', 
    component: KegiatanPage,
    title: 'Kegiatan',
  },
  { 
    path: '/galeri', 
    component: GaleriPage,
    title: 'Galeri',
  },
  { 
    path: '/pendaftaran', 
    component: PendaftaranPage,
    title: 'Pendaftaran',
  },
  { 
    path: '/kontak', 
    component: KontakPage,
    title: 'Kontak',
  },
  { 
    path: '/pendaftaran-redirect', 
    component: PendaftaranRedirect,
    title: 'Pendaftaran',
  },
];

// ========== ADMIN AUTH ROUTES ==========
export const adminAuthRoutes = [
  { 
    path: '/admin/login', 
    component: AdminLogin,
    title: 'Login Admin',
    layout: 'auth',
  },
  { 
    path: '/admin/forgot-password', 
    component: ForgotPassword,
    title: 'Lupa Password',
    layout: 'auth',
  },
  { 
    path: '/admin/reset-password', 
    component: ResetPassword,
    title: 'Reset Password',
    layout: 'auth',
  },
];

// ========== ADMIN PROTECTED ROUTES ==========
export const adminRoutes = [
  { 
    path: '/admin', 
    component: AdminDashboard,
    title: 'Dashboard',
    requiresAuth: true,
    exact: true,
  },
  { 
    path: '/admin/struktur', 
    component: AdminStruktur,
    title: 'Kelola Struktur',
    requiresAuth: true,
  },
  { 
    path: '/admin/program', 
    component: AdminProgram,
    title: 'Kelola Program',
    requiresAuth: true,
  },
  { 
    path: '/admin/kegiatan', 
    component: AdminKegiatan,
    title: 'Kelola Kegiatan',
    requiresAuth: true,
  },
  { 
    path: '/admin/galeri', 
    component: AdminGaleri,
    title: 'Kelola Galeri',
    requiresAuth: true,
  },
  { 
    path: '/admin/settings', 
    component: AdminSettings,
    title: 'Pengaturan',
    requiresAuth: true,
  },
];

// ========== ALL ROUTES ==========
export const allRoutes = [
  ...publicRoutes,
  ...adminAuthRoutes,
  ...adminRoutes,
];

// ========== GET ROUTE META ==========
export const getRouteMeta = (path) => {
  return routeMeta[path] || { 
    title: 'PMR Wira SMKN 1 Pringgabaya', 
    description: 'PMR Wira SMKN 1 Pringgabaya' 
  };
};

// ========== GET ROUTE BY PATH ==========
export const getRouteByPath = (path) => {
  return allRoutes.find(route => route.path === path);
};

// ========== IS ADMIN ROUTE ==========
export const isAdminRoute = (path) => {
  return adminRoutes.some(route => route.path === path);
};

// ========== IS AUTH ROUTE ==========
export const isAuthRoute = (path) => {
  return adminAuthRoutes.some(route => route.path === path);
};

// ========== IS PUBLIC ROUTE ==========
export const isPublicRoute = (path) => {
  return publicRoutes.some(route => route.path === path);
};