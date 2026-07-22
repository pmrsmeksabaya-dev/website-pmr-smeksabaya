import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Facebook, Instagram, Youtube, Send, Share2, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoPmr from '../assets/pmr.png';
import logosmk from '../assets/smk.png';

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

  // Logo size based on scroll
  const logoSizes = isScrolled 
    ? 'h-6 w-6 md:h-8 md:w-8' 
    : 'h-8 w-8 md:h-10 md:w-10';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: theme === 'light' 
          ? (isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)')
          : (isScrolled ? 'rgba(17,24,39,0.95)' : 'rgba(17,24,39,1)'),
        boxShadow: isScrolled 
          ? (theme === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.08)' 
              : '0 4px 20px rgba(0,0,0,0.3)')
          : 'none',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? 'none' : (theme === 'light' ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)'),
        height: isScrolled ? '56px' : '64px',
      }}
    >
      <div className="container-custom h-full flex items-center">
        <div className="flex justify-between items-center w-full">
          
          {/* ===== LOGO - TETAP BG PUTIH ===== */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            {/* SMK Logo - BG PUTIH */}
            <div 
              className="rounded-lg p-1 transition-all duration-300 group-hover:scale-105"
              style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <img 
                src={logosmk} 
                alt="SMK" 
                className={`${logoSizes} object-contain transition-all duration-300`}
              />
            </div>

            {/* PMR Logo - BG PUTIH */}
            <div 
              className="rounded-lg p-1 transition-all duration-300 group-hover:scale-105"
              style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <img 
                src={logoPmr} 
                alt="PMR" 
                className={`${logoSizes} object-contain transition-all duration-300`}
              />
            </div>
            
            {/* Text - shrink saat scroll */}
            <div className={`hidden md:block ml-1 transition-all duration-300 ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <h1 className="font-bold text-base bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
                PMR WIRA
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">SMKN 1 Pringgabaya</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-1 py-1 text-sm font-medium transition-all duration-300 hover:text-pmi group ${
                  location.pathname === link.to ? 'text-pmi' : 'text-gray-700 dark:text-gray-300'
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-sm"
              >
                <Share2 size={14} className="text-pmi" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ikuti</span>
              </button>
              
              <AnimatePresence>
                {isSocialOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-2 border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 transition-all duration-200 group text-sm"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              {theme === 'light' ? <Moon size={16} className="text-gray-700" /> : <Sun size={16} className="text-yellow-400" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleTheme} 
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700"
            >
              {theme === 'light' ? <Moon size={16} className="text-gray-700" /> : <Sun size={16} className="text-yellow-400" />}
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white dark:bg-gray-800 shadow-2xl absolute top-full left-0 right-0"
            >
              <div className="p-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2.5 px-4 rounded-xl transition-all duration-300 text-sm ${
                      location.pathname === link.to 
                        ? 'bg-gradient-to-r from-pmi/10 to-maroon/10 text-pmi font-semibold' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
                
                <div className="px-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;