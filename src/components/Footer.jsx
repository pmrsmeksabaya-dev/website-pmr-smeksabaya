import { Link } from 'react-router-dom';
import { Heart, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import logoPmr from '../assets/pmr.jpg';
import logoPmi from '../assets/pmi.jpg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoPmr} alt="PMR" className="h-12 w-12 object-contain" />
              <img src={logoPmi} alt="PMI" className="h-12 w-12 object-contain" />
            </div>
            <h3 className="font-bold text-lg">PMR WIRA</h3>
            <p className="text-gray-400 text-sm">SMKN 1 Pringgabaya</p>
            <p className="text-gray-400 text-sm mt-2">"Siap Menolong Sesama Dengan Tulus dan Ikhlas"</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-pmi transition">Beranda</Link></li>
              <li><Link to="/profil" className="hover:text-pmi transition">Profil</Link></li>
              <li><Link to="/struktur-organisasi" className="hover:text-pmi transition">Struktur</Link></li>
              <li><Link to="/program-kerja" className="hover:text-pmi transition">Program Kerja</Link></li>
              <li><Link to="/pendaftaran" className="hover:text-pmi transition">Pendaftaran</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Media Sosial</h4>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1FnbuMwaff/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#1877f2] transition">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/laspraja_smkn1baya" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-[#f09433] hover:to-[#bc1888] transition">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@pmrsmeksaofficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition">
                <Send size={18} />
              </a>
              <a href="https://www.youtube.com/@pmrwira.smkn1pringgabaya" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff0000] transition">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <p className="text-gray-400 text-sm">SMKN 1 Pringgabaya</p>
            <p className="text-gray-400 text-sm">Jl. Raya Pringgabaya, Lombok Timur, NTB</p>
            <p className="text-gray-400 text-sm mt-2">WhatsApp: +62 123 4567 890</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 PMR Wira Unit SMKN 1 Pringgabaya. Made with <Heart size={14} className="inline text-pmi" /> for humanity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;