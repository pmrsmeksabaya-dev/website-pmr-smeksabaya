import { useState, useEffect } from 'react';
import logoPmr from '../assets/pmr.png';
import logoPmi from '../assets/pmi.png';

const PremiumLogo = ({ size = 'md', variant = 'default', className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'p-3 rounded-2xl',
    md: 'p-4 rounded-2xl md:rounded-3xl',
    lg: 'p-6 rounded-3xl',
    xl: 'p-8 rounded-[32px]'
  };

  const imageSizes = {
    sm: 'w-12 h-12 md:w-14 md:h-14',
    md: 'w-16 h-16 md:w-20 md:h-20',
    lg: 'w-24 h-24 md:w-28 md:h-28',
    xl: 'w-32 h-32 md:w-40 md:h-40'
  };

  const containerClasses = {
    default: 'bg-white shadow-premium',
    hero: 'bg-white/90 backdrop-blur-sm shadow-premium-lg',
    card: 'bg-white shadow-premium',
    compact: 'bg-white shadow-premium'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${containerClasses[variant]}
        border border-gray-100/80
        transition-all duration-300 ease-out
        ${isHovered ? 'transform -translate-y-1 scale-[1.02] shadow-premium-hover' : ''}
        ${className}
      `}
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: variant === 'hero' 
          ? '0 8px 32px rgba(0, 0, 0, 0.08)' 
          : '0 8px 24px rgba(0, 0, 0, 0.06)',
        borderRadius: variant === 'hero' ? '28px' : '24px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center justify-center ${variant === 'compact' ? 'gap-2' : 'gap-4 md:gap-6'}`}>
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

        {/* Separator - hanya tampil jika bukan compact */}
        {variant !== 'compact' && (
          <div className="h-12 md:h-16 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
        )}

        {/* PMI Logo */}
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
      </div>
    </div>
  );
};

// Hero Logo Component - Khusus untuk tampilan utama
export const HeroLogo = ({ className = '' }) => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    setIsFloating(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Background clean - TANPA GLOW MERAH */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white rounded-3xl -z-10"></div>
      
      {/* Premium Container */}
      <div 
        className={`
          relative p-6 md:p-8 lg:p-10 
          bg-white/95 backdrop-blur-sm
          border border-gray-100/80
          rounded-[32px] md:rounded-[40px]
          transition-all duration-500
          ${isFloating ? 'animate-float-premium' : ''}
        `}
        style={{
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.5) inset'
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12">
          {/* PMR Logo Hero */}
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

          {/* PMI Logo Hero */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={logoPmi} 
              alt="PMI Logo" 
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain transition-all duration-500 group-hover:scale-105"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))'
              }}
            />
          </div>
        </div>

        {/* Optional Text */}
        <div className="text-center mt-6 md:mt-8">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pmi to-maroon bg-clip-text text-transparent">
            PMR WIRA
          </h2>
          <p className="text-sm text-gray-500 mt-1">SMKN 1 Pringgabaya</p>
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