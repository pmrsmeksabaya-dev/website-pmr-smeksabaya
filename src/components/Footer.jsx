import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import PremiumLogo from './PremiumLogo';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/1FnbuMwaff/', bgColor: '#1877f2' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/laspraja_smkn1baya', bgColor: '#e4405f' },
    { name: 'TikTok', icon: Send, url: 'https://www.tiktok.com/@pmrsmeksaofficial', bgColor: '#000000' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya', bgColor: '#ff0000' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo Section - PAKAI PREMIUM LOGO */}
          <div>
            <div className="mb-4">
              <PremiumLogo size="sm" variant="card" />
            </div>
            <h3 className="font-bold text-lg text-pmi">PMR WIRA</h3>
            <p className="text-gray-400 text-sm">SMKN 1 Pringgabaya</p>
            <p className="text-gray-400 text-sm mt-2 italic">"Siap Menolong Sesama Dengan Tulus dan Ikhlas"</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 border-l-4 border-pmi pl-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-pmi transition">Beranda</Link></li>
              <li><Link to="/profil" className="hover:text-pmi transition">Profil</Link></li>
              <li><Link to="/struktur-organisasi" className="hover:text-pmi transition">Struktur</Link></li>
              <li><Link to="/program-kerja" className="hover:text-pmi transition">Program Kerja</Link></li>
              <li><Link to="/pendaftaran" className="hover:text-pmi transition">Pendaftaran</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 border-l-4 border-pmi pl-3">Media Sosial</h4>
            <div className="space-y-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition group"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: social.bgColor }}>
                    <social.icon size={14} className="text-white" />
                  </div>
                  <span className="text-gray-400 group-hover:text-white transition">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 border-l-4 border-pmi pl-3">Kontak</h4>
            <p className="text-gray-400 text-sm">SMKN 1 Pringgabaya</p>
            <p className="text-gray-400 text-sm">Jl. Raya Pringgabaya, Lombok Timur, NTB</p>
            <p className="text-gray-400 text-sm mt-2">WhatsApp: +62 859 7433 5511</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2026 PMR Wira Unit SMKN 1 Pringgabaya. Made with <Heart size={14} className="inline text-pmi" /> for humanity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;