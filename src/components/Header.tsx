import Image from 'next/image';
import { colors } from '@/styles/colors';

const Header = () => {
  return (
    <header className="w-[1920px] h-[178px] bg-[#090B1E]">
      {/* Üst Bölüm */}
      <div className="w-full h-[50px] flex justify-between items-center px-8">
        <div className="text-white font-['DM_Sans'] text-[18px] font-normal leading-normal tracking-[0.72px]">
          Mon - Sun: 09.00 - 18.00
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/images/mail.svg" alt="Email" width={24} height={24} />
            <span className="text-white font-['DM_Sans'] text-[18px] font-normal leading-normal tracking-[0.36px]">
              info@igual.com
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Image src="/images/location_on.svg" alt="Location" width={24} height={24} />
            <span className="text-white font-['DM_Sans'] text-[18px] font-normal leading-normal tracking-[0.54px]">
              4b, Walse Street, USA
            </span>
          </div>
        </div>
      </div>

      {/* Alt Bölüm */}
      <div className="w-full h-[128px] flex items-center">
        {/* Logo Bölümü */}
        <div className="w-[266px] h-[128px] border border-[#E0E0E0] flex items-center justify-center">
          <Image 
            src="/images/logo.svg" 
            alt="Logo" 
            width={169} 
            height={169} 
            className="flex-shrink-0 -mt-4"
          />
        </div>

        {/* Navigasyon ve İletişim Bölümü */}
        <div className="w-[1655px] h-[128px] border border-[#E0E0E0] flex items-center justify-between px-[43px]">
          {/* Navigasyon */}
          <nav className="flex items-center gap-[79px]">
            <div className="relative">
              <a href="#" className="relative text-[#BA9881] font-['DM_Sans'] text-[17px] font-medium leading-normal tracking-[1.87px] inline-block">
                HOME
              </a>
              <div className="absolute w-[25px] h-[22px]" style={{ left: '-7px', top: '-3.5px', backgroundColor: colors.primary.brown, opacity: 0.4, borderRadius: '0 8px 0 8px' }} />
            </div>
            <a href="#" className="text-white font-['DM_Sans'] text-[17px] font-medium leading-normal tracking-[1.87px]">
              PAGES
            </a>
            <a href="#" className="text-white font-['DM_Sans'] text-[17px] font-medium leading-normal tracking-[1.87px]">
              PRACTICE AREAS
            </a>
            <a href="#" className="text-white font-['DM_Sans'] text-[17px] font-medium leading-normal tracking-[1.87px]">
              FEATURES
            </a>
            <a href="#" className="text-white font-['DM_Sans'] text-[17px] font-medium leading-normal tracking-[1.87px]">
              BLOG
            </a>
            <a href="#" className="text-white font-['DM_Sans'] text-[17px] font-medium leading-normal tracking-[1.87px]">
              CONTACT US
            </a>
          </nav>

          {/* İletişim ve Arama */}
          <div className="flex items-center">
            <div className="flex items-center">
              <Image 
                src="/images/Phone forwarded.svg" 
                alt="Phone" 
                width={21} 
                height={21} 
                className="flex-shrink-0"
              />
              <span className="text-white font-['DM_Sans'] text-[23px] font-normal leading-normal tracking-[1.38px] ml-[11px]">
                +(528) 456-7592
              </span>
              <Image 
                src="/images/search.svg" 
                alt="Search" 
                width={28} 
                height={28} 
                className="ml-[25px]"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
