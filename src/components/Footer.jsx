import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PremiumLogo from './PremiumLogo';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/1FnbuMwaff/', bgColor: '#1877f2' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/laspraja_smkn1baya', bgColor: '#e4405f' },
    { name: 'TikTok', icon: Send, url: 'https://www.tiktok.com/@pmrsmeksaofficial', bgColor: '#000000' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya', bgColor: '#ff0000' },
  ];

  return (
    <footer className={`
      ${isDark ? 'bg-gray-900' : 'bg-gray-50'}
      border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}
      pt-12 pb-6 transition-colors duration-300
    `}>
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* ===== LOGO SECTION ===== */}
          <div>
            <div className="mb-4 inline-block">
              <PremiumLogo 
                size="sm" 
                variant="compact"
                className="shadow-md"
              />
            </div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
              PMR WIRA
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              SMKN 1 Pringgabaya
            </p>
            <p className={`text-sm mt-2 italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              "Siap Menolong Sesama Dengan Tulus dan Ikhlas"
            </p>
          </div>

          {/* ===== QUICK LINKS ===== */}
          <div>
            <h4 className={`font-semibold mb-4 border-l-4 border-pmi pl-3 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {['Beranda', 'Profil', 'Struktur', 'Program Kerja', 'Pendaftaran'].map((label, idx) => {
                const paths = ['/', '/profil', '/struktur-organisasi', '/program-kerja', '/pendaftaran'];
                return (
                  <li key={idx}>
                    <Link 
                      to={paths[idx]}
                      className={`transition hover:text-pmi ${
                        isDark ? 'text-gray-400 hover:text-pmi' : 'text-gray-500 hover:text-pmi'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ===== SOCIAL MEDIA ===== */}
          <div>
            <h4 className={`font-semibold mb-4 border-l-4 border-pmi pl-3 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Media Sosial
            </h4>
            <div className="space-y-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-2 rounded-lg transition group ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: social.bgColor }}>
                    <social.icon size={14} className="text-white" />
                  </div>
                  <span className={`transition ${
                    isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-800'
                  }`}>
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ===== CONTACT ===== */}
          <div>
            <h4 className={`font-semibold mb-4 border-l-4 border-pmi pl-3 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Kontak
            </h4>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              SMKN 1 Pringgabaya
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Jl. Raya Mataram - Labuhan Lombok No.KM.3, Pringgabaya Utara, Kec. Pringgabaya, Kabupaten Lombok Timur, Nusa Tenggara Barat.
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              WhatsApp: <a href="https://wa.me/6285974335511" className="hover:text-pmi transition">+62 859 7433 5511</a>
            </p>
          </div>
        </div>

        {/* ===== BOTTOM ===== */}
        <div className={`border-t pt-6 text-center text-sm ${
          isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'
        }`}>
          <p>
            &copy; {new Date().getFullYear()} PMR Wira Unit SMKN 1 Pringgabaya. 
            Made with <Heart size={14} className="inline text-pmi" /> for humanity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;