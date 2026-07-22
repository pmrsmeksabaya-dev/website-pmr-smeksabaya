import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import logoPmr from '../assets/pmr.png';
import logoPmi from '../assets/pmi.png'; // Kalo ada

const PremiumLogo = ({ size = 'md', variant = 'default', className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'p-2 rounded-xl',
    md: 'p-3 rounded-2xl md:rounded-3xl',
    lg: 'p-4 rounded-3xl',
    xl: 'p-6 rounded-[32px]'
  };

  const imageSizes = {
    sm: 'w-10 h-10 md:w-12 md:h-12',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-20 h-20 md:w-24 md:h-24',
    xl: 'w-28 h-28 md:w-32 md:h-32'
  };

  // ===== BACKGROUND TETAP PUTIH =====
  const bgColor = '#FFFFFF';

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        transition-all duration-300 ease-out
        ${isHovered ? 'transform -translate-y-1 scale-[1.02] shadow-premium-hover' : ''}
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        boxShadow: variant === 'hero' 
          ? '0 8px 32px rgba(0,0,0,0.08)' 
          : '0 8px 24px rgba(0,0,0,0.06)',
        borderRadius: variant === 'hero' ? '28px' : '24px',
        border: '1px solid rgba(0,0,0,0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center justify-center ${variant === 'compact' ? 'gap-2' : 'gap-3 md:gap-4'}`}>
        {/* PMR Logo */}
        <div className="relative">
          <img 
            src={logoPmr} 
            alt="PMR Logo" 
            className={`
              ${imageSizes[size]} 
              object-contain 
              transition-all duration-300
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))'
            }}
          />
        </div>

        {/* PMI Logo (kalo ada) */}
        {logoPmi && (
          <>
            <div className="h-8 md:h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            <div className="relative">
              <img 
                src={logoPmi} 
                alt="PMI Logo" 
                className={`
                  ${imageSizes[size]} 
                  object-contain 
                  transition-all duration-300
                  ${isHovered ? 'scale-105' : 'scale-100'}
                `}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))'
                }}
              />
            </div>
          </>
        )}

        {/* Text */}
        {variant !== 'compact' && (
          <div className="hidden sm:block ml-2">
            <h3 className="font-bold text-base md:text-lg bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
              PMR WIRA
            </h3>
            <p className="text-xs md:text-sm text-gray-500">SMKN 1 Pringgabaya</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== HERO LOGO ==========
export const HeroLogo = ({ className = '' }) => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    setIsFloating(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white rounded-3xl -z-10"></div>
      
      <div 
        className={`
          relative p-6 md:p-8 lg:p-10 
          bg-white
          border border-gray-100/80
          rounded-[32px] md:rounded-[40px]
          transition-all duration-500
          ${isFloating ? 'animate-float-premium' : ''}
        `}
        style={{
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset'
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12">
          {/* PMR Logo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={logoPmr} 
              alt="PMR Logo" 
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain transition-all duration-500 group-hover:scale-105"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))'
              }}
            />
          </div>

          {/* Divider */}
          <div className="text-center sm:text-left">
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden sm:block mx-auto"></div>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent block sm:hidden mx-auto"></div>
          </div>

          {/* Text */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
              PMR WIRA
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              SMKN 1 Pringgabaya
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatPremium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-premium {
          animation: floatPremium 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PremiumLogo;