import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Facebook, Instagram, Youtube, Send, Share2, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PremiumLogo from './PremiumLogo';

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass shadow-2xl' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section - PAKAI PREMIUM LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <PremiumLogo size="sm" variant="compact" />
            <div className="hidden md:block">
              <h1 className="font-bold text-lg bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
                PMR WIRA
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">SMKN 1 Pringgabaya</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 hover:text-pmi group ${
                  location.pathname === link.to ? 'text-pmi' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pmi to-maroon transition-all duration-300 ${
                  location.pathname === link.to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
            
            {/* Sosmed Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSocialOpen(!isSocialOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-pmi/10 to-maroon/10 hover:from-pmi/20 hover:to-maroon/20 transition-all duration-300"
              >
                <Share2 size={16} className="text-pmi" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ikuti</span>
              </button>
              
              {isSocialOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-2 border dark:border-gray-700 z-50 overflow-hidden animate-fade-in">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 transition-all duration-200 group"
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
                      <social.icon size={18} />
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-full bg-gradient-to-r from-pmi to-maroon text-white"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[calc(100vh-64px)] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                  location.pathname === link.to 
                    ? 'bg-gradient-to-r from-pmi/10 to-maroon/10 text-pmi font-semibold' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t dark:border-gray-700 my-4"></div>
            
            <div className="px-4">
              <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Heart size={14} className="text-pmi" /> Ikuti Kami di Media Sosial
              </p>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: social.color }}
                  >
                    <social.icon size={18} className="text-white" />
                    <span className="text-white text-sm font-medium">{social.name}</span>
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