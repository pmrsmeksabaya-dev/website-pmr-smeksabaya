import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoPmr from '../assets/pmr.jpg';
import logoPmi from '../assets/pmi.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : 'bg-white dark:bg-gray-900'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoPmr} alt="PMR" className="h-10 w-10 object-contain" />
            <img src={logoPmi} alt="PMI" className="h-10 w-10 object-contain" />
            <div className="hidden md:block">
              <h1 className="font-bold text-sm md:text-base text-pmi dark:text-pmi">PMR WIRA</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">SMKN 1 Pringgabaya</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-pmi transition ${location.pathname === link.to ? 'text-pmi font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass absolute left-0 right-0 top-16 p-4 shadow-xl">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block py-3 hover:text-pmi transition ${location.pathname === link.to ? 'text-pmi font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;