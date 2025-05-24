'use client';

import Image from 'next/image';
import { theme } from '@/styles/theme';

export const Hero = () => {
  return (
    <section 
      className="relative w-[1920px] h-[1043px] bg-[#090B1E] overflow-hidden"
      style={{ backgroundColor: theme.colors.primary.dark }}
    >
      {/* Arka plan dikdörtgeni - doğal DOM sıralamasıyla fotoğrafın arkasında */}
      <div 
        className="absolute left-[1402px] top-[387px] w-[409px] h-[364px] rounded-tr-[63px]"
        style={{ backgroundColor: theme.colors.accent.brown }}
      />

      {/* Ana başlık */}
      <h1 
        className="absolute left-[220px] top-[220px] w-[911px] h-[333px] text-white font-['Marcellus'] text-[100px] font-normal leading-[113px] z-10"
        style={{ color: theme.colors.primary.light }}
      >
        Having 20+ Years of Experience in Legal Service
      </h1>

      {/* Profil resmi */}
      <div className="absolute left-[901px] top-[-21px] w-[1063px] h-[1064px] z-10">
        <Image
          src="/images/ugursahan.webp"
          alt="Uğur Şahan"
          width={1063}
          height={1064}
          priority
          className="object-cover"
        />
      </div>

      {/* Glitter efekti */}
      <div 
        className="absolute left-[1020.29px] top-[211.13px] w-[77.674px] h-[77.674px] z-20"
        style={{ transform: 'rotate(-10.694deg)' }}
      >
        <Image
          src="/images/glitter 1.svg"
          alt="Glitter effect"
          width={77.674}
          height={77.674}
          className="object-contain"
        />
      </div>

      {/* Butonlar */}
      <div className="absolute left-[220px] top-[641px] flex gap-2 z-10">
        <button 
          className="w-[69px] h-[66px] bg-white rounded-tl-[20px] flex items-center justify-center"
          style={{ backgroundColor: theme.colors.primary.light }}
        >
          <span className="text-[#090B1E] text-2xl">+</span>
        </button>
        <button 
          className="w-[289px] h-[66px] rounded-br-[20px] flex items-center justify-center text-white font-['DM_Sans'] text-[19px] font-semibold tracking-[0.57px]"
          style={{ backgroundColor: theme.colors.accent.brown }}
        >
          CONTACT US
        </button>
      </div>
    </section>
  );
}; 