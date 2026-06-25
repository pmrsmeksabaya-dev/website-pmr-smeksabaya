import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Facebook, Instagram, Youtube, Send, Share2, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoPmr from '../assets/pmr.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/profil', label: 'Profil' },
    { to: '/struktur-organisasi', label: 'Struktur' },
    { to: '/program-kerja', label: 'Program' },
    { to: '/kegiatan', label: 'Kegiatan' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/pendaftaran', label: 'Pendaftaran' },
    { to: '/kontak', label: 'Kontak' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/1FnbuMwaff/', color: '#1877f2' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/laspraja_smkn1baya', color: '#e4405f' },
    { name: 'TikTok', icon: Send, url: 'https://www.tiktok.com/@pmrsmeksaofficial', color: '#000000' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya', color: '#ff0000' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.05)'
      }}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-14 md:h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-pmi/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                <img 
                  src={logoPmr} 
                  alt="PMR" 
                  className="relative h-8 w-8 md:h-10 md:w-10 object-contain transition-all duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
            
            <div className="hidden md:block">
              <h1 className="font-bold text-base bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
                PMR WIRA
              </h1>
              <p className="text-[10px] text-gray-500">SMKN 1 Pringgabaya</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-1 py-1 text-sm font-medium transition-all duration-300 hover:text-pmi group ${
                  location.pathname === link.to ? 'text-pmi' : 'text-gray-700'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pmi to-maroon transition-all duration-300 ${
                  location.pathname === link.to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setIsSocialOpen(!isSocialOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-sm"
              >
                <Share2 size={14} className="text-pmi" />
                <span className="text-xs font-medium text-gray-700">Ikuti</span>
              </button>
              
              {isSocialOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 z-50 overflow-hidden">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 transition-all duration-200 group text-sm"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = social.color;
                        e.currentTarget.style.color = 'white';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '';
                      }}
                      onClick={() => setIsSocialOpen(false)}
                    >
                      <social.icon size={16} />
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-1.5 rounded-full bg-gray-100">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-1.5 rounded-full bg-gradient-to-r from-pmi to-maroon text-white"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-14 left-0 right-0 bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[calc(100vh-56px)] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block py-2.5 px-4 rounded-xl transition-all duration-300 text-sm ${
                  location.pathname === link.to 
                    ? 'bg-gradient-to-r from-pmi/10 to-maroon/10 text-pmi font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 my-3"></div>
            
            <div className="px-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <Heart size={12} className="text-pmi" /> Ikuti Kami di Media Sosial
              </p>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    style={{ backgroundColor: social.color }}
                  >
                    <social.icon size={16} className="text-white" />
                    <span className="text-white text-xs font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;