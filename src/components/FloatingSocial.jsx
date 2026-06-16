import { useState, useEffect } from 'react';
import { X, Facebook, Instagram, Youtube, Send, Phone } from 'lucide-react';
import logoPmr from '../assets/pmr.png';

const FloatingSocial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Hide floating social when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { name: 'TikTok', icon: Send, url: 'https://www.tiktok.com/@pmrsmeksaofficial', color: '#000000', delay: 0 },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/laspraja_smkn1baya', color: '#e4405f', delay: 0.1 },
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/1FnbuMwaff/', color: '#1877f2', delay: 0.2 },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya', color: '#ff0000', delay: 0.3 },
    { name: 'WhatsApp', icon: Phone, url: 'https://wa.me/6281234567890', color: '#25D366', delay: 0.4 },
  ];

  
  const buttonSize = 'w-10 h-10 md:w-12 md:h-12';
  const iconSize = 16;

  return (
    <div 
      className={`fixed bottom-6 left-4 md:bottom-8 md:left-8 z-50 transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
      }`}
    >
    
      <div
        className={`absolute bottom-16 left-0 flex flex-col gap-3 transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible translate-y-4'
        }`}
      >
        {socialLinks.map((social, idx) => (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
            style={{ animationDelay: `${social.delay}s` }}
            onClick={() => setIsOpen(false)}
          >
            <div
              className={`${buttonSize} rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl`}
              style={{ 
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <social.icon 
                size={iconSize} 
                className="transition-colors duration-300"
                style={{ color: social.color }}
              />
            </div>
            {/* Tooltip */}
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
              {social.name}
            </span>
          </a>
        ))}
      </div>

      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonSize} rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none ${
          isOpen ? 'shadow-2xl ring-2 ring-pmi/30' : 'hover:shadow-2xl'
        }`}
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      >
        
        <div className={`absolute inset-0 rounded-full border-2 border-pmi/30 transition-all duration-300 ${
          isOpen ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
        }`}></div>
        
        
        {isOpen ? (
          <X 
            size={iconSize + 4} 
            className="text-pmi transition-all duration-300"
            strokeWidth={2}
          />
        ) : (
          <img 
            src={logoPmr} 
            alt="PMR" 
            className="w-9 h-9 md:w-10 md:h-10 object-contain transition-all duration-300"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        )}
      </button>
    </div>
  );
};

export default FloatingSocial;