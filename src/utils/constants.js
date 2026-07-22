// ========== ICON MAPPING ==========
// Untuk digunakan di komponen yang butuh icon dari string
export const ICON_MAP = {
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  Send: 'Send',
  Youtube: 'Youtube',
};

// ========== NAVIGATION ==========
export const NAV_LINKS = [
  { to: '/', label: 'Beranda', icon: 'Home' },
  { to: '/profil', label: 'Profil', icon: 'User' },
  { to: '/struktur-organisasi', label: 'Struktur', icon: 'Users' },
  { to: '/program-kerja', label: 'Program', icon: 'Calendar' },
  { to: '/kegiatan', label: 'Kegiatan', icon: 'Activity' },
  { to: '/galeri', label: 'Galeri', icon: 'Image' },
  { to: '/pendaftaran', label: 'Pendaftaran', icon: 'FileText' },
  { to: '/kontak', label: 'Kontak', icon: 'Phone' },
];

// ========== SOCIAL MEDIA ==========
export const SOCIAL_MEDIA = [
  { 
    name: 'Facebook', 
    icon: 'Facebook', 
    url: 'https://www.facebook.com/share/1FnbuMwaff/',
    color: '#1877f2',
    username: 'PMR Wira Smkn Prbya',
  },
  { 
    name: 'Instagram', 
    icon: 'Instagram', 
    url: 'https://www.instagram.com/laspraja_smkn1baya',
    color: '#e4405f',
    username: 'laspraja_smkn1baya',
  },
  { 
    name: 'TikTok', 
    icon: 'Send', 
    url: 'https://www.tiktok.com/@pmrsmeksaofficial',
    color: '#000000',
    username: 'pmrsmeksaofficial',
  },
  { 
    name: 'YouTube', 
    icon: 'Youtube', 
    url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya',
    color: '#ff0000',
    username: 'PMR Wira Unit SMKN 1 Pringgabaya',
  },
];

// ========== ORGANIZATION VALUES ==========
export const ORGANIZATION_VALUES = [
  { name: 'Kemanusiaan', icon: 'Heart', description: 'Mengutamakan nilai-nilai kemanusiaan' },
  { name: 'Kepemimpinan', icon: 'Crown', description: 'Membangun jiwa kepemimpinan' },
  { name: 'Solidaritas', icon: 'Handshake', description: 'Menciptakan rasa kebersamaan' },
  { name: 'Kerelawanan', icon: 'Sparkles', description: 'Menumbuhkan jiwa kerelawanan' },
  { name: 'Kedisiplinan', icon: 'Clock', description: 'Menerapkan kedisiplinan' },
  { name: 'Kesiapsiagaan', icon: 'Shield', description: 'Membangun kesiapsiagaan' },
];

// ========== EXTERNAL URLS ==========
export const EXTERNAL_URLS = {
  DAFTAR: 'https://pmrsmeksabaya-daftar.vercel.app/',
  WHATSAPP: 'https://wa.me/6285974335511',
  EMAIL: 'mailto:pmrsmeksabaya@gmail.com',
  MAPS: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3945.123456789!2d116.636264!3d-8.53305!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzEnNTkuMCJTIDExNsKwMzgnMTAuNiJF!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid',
  SCHOOL_WEBSITE: 'https://smkn1pringgabaya.sch.id',
};

// ========== CONTACT INFO ==========
export const CONTACT_INFO = {
  whatsapp: '+62 859 7433 5511',
  email: 'pmrsmeksabaya@gmail.com',
  address: 'Jl. Raya Mataram - Labuhan Lombok No.KM.3, Pringgabaya Utara, Kec. Pringgabaya, Kabupaten Lombok Timur, Nusa Tenggara Barat. 83654',
};

// ========== DEFAULT SETTINGS ==========
export const DEFAULT_SETTINGS = {
  nama_organisasi: 'PMR Wira SMKN 1 Pringgabaya',
  tagline: 'Siap Menolong Sesama Dengan Tulus dan Ikhlas',
  warna_primary: '#d32f2f',
  warna_secondary: '#8b0000',
  hero_judul: 'PMR WIRA SMKN 1 PRINGGABAYA',
  hero_subjudul: 'Organisasi Kepalangmerahan',
  hero_deskripsi: 'Membentuk generasi muda berjiwa kemanusiaan',
  stat_anggota: '30+',
  stat_program: '8+',
  stat_kegiatan: '4',
  stat_prestasi: '1',
};

// ========== STATUS COLORS ==========
export const STATUS_COLORS = {
  Rencana: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Berjalan: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Selesai: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Rahasia: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

// ========== POSITION COLORS ==========
export const POSITION_COLORS = {
  'Ketua': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Wakil Ketua': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Sekretaris': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Bendahara': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Ketua Divisi': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Anggota': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

// ========== DIVISIONS ==========
export const DIVISIONS = [
  'Keanggotaan',
  'Media',
  'Perlengkapan',
  'Humas',
  'UKS',
];

// ========== PROGRAM STATUSES ==========
export const PROGRAM_STATUSES = ['Rencana', 'Berjalan', 'Selesai', 'Rahasia'];

// ========== JABATAN OPTIONS ==========
export const JABATAN_OPTIONS = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Ketua Divisi', 'Anggota'];

// ========== GENDER OPTIONS ==========
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

// ========== TIPE PENGURUS ==========
export const TIPE_PENGURUS = [
  { value: 'resmi', label: 'Pengurus Resmi' },
  { value: 'sementara', label: 'Pengurus Sementara' },
];

// ========== HELPERS ==========
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
};

export const getPositionColor = (position) => {
  return POSITION_COLORS[position] || 'bg-gray-100 text-gray-700';
};

// ========== DEFAULT EXPORT ==========
export default {
  NAV_LINKS,
  SOCIAL_MEDIA,
  ORGANIZATION_VALUES,
  EXTERNAL_URLS,
  CONTACT_INFO,
  DEFAULT_SETTINGS,
  STATUS_COLORS,
  POSITION_COLORS,
  DIVISIONS,
  PROGRAM_STATUSES,
  JABATAN_OPTIONS,
  GENDER_OPTIONS,
  TIPE_PENGURUS,
  getStatusColor,
  getPositionColor,
};