'use client';

import Image from 'next/image';
import { DM_Sans, Marcellus } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans'
});

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus'
});

export const AboutUs = () => {
  return (
    <section className="w-[1920px] h-[1366px] bg-white relative">
      {/* Üst gri container */}
      <div className="absolute top-0 left-0 w-full h-[458px] bg-[#E0E0E0] bg-opacity-30" />

      {/* Sol üst resim */}
      <div className="absolute left-[219px] top-[166px] w-[745px] h-[894px] overflow-hidden">
        <Image
          src="/images/webp.webp"
          alt="About Us"
          width={745}
          height={894}
          className="rounded-[125px] rounded-tr-none rounded-bl-none"
        />
      </div>

      {/* Sol alıntı ikonu */}
      <div className="absolute left-[219px] top-[1100px] w-[62px] h-[47px]">
        <Image
          src="/images/left-quote.webp"
          alt="Quote"
          width={62}
          height={47}
        />
      </div>

      {/* Alıntı metni */}
      <p 
        className={`absolute left-[314px] top-[1097px] w-[589px] text-[#777] text-[21px] font-normal leading-[38px] tracking-[0.735px] ${dmSans.className}`}
        style={{ fontStyle: 'italic' }}
      >
        The good lawyer is not the man who has an eye to every side and angle of contingency, and qualifies
      </p>

      {/* Sağ üst resim */}
      <div className="absolute left-[1058px] top-[515px] w-[643px] h-[428px]">
        <Image
          src="/images/webp-1.webp"
          alt="Law Practice"
          width={643}
          height={428}
        />
      </div>

      {/* Beyaz dikdörtgen */}
      <div className="absolute left-[1096px] top-[828px] w-[567px] h-[361px] bg-white rounded-[60px] rounded-tr-none rounded-bl-none border border-[#E0E0E0]" />

      {/* Sol dekoratif dikdörtgen */}
      <div 
        className="absolute left-[1266px] top-[883px] w-[25px] h-[17px] rounded-[10px] rounded-tr-none rounded-bl-none"
        style={{ background: 'linear-gradient(115deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)' }}
      />

      {/* Sağ dekoratif dikdörtgen */}
      <div 
        className="absolute left-[1466px] top-[883px] w-[25px] h-[17px] rounded-[10px] rounded-tr-none rounded-bl-none"
        style={{ background: 'linear-gradient(115deg, rgba(186, 152, 129, 0.00) 0%, #BA9881 100%)' }}
      />

      {/* ASK A LAWYER başlığı */}
      <div className={`absolute left-[1301px] top-[879px] ${dmSans.className}`}>
        <span className="text-[#BA9881] text-[20px] font-normal leading-normal tracking-[1.6px]">ASK A LAWYER</span>
      </div>

      {/* We Provide Solid Law Practice başlığı */}
      <h2 className={`absolute left-[1167px] top-[921px] w-[426px] h-[104px] text-[#090B1E] text-center text-[44px] font-normal leading-[52px] ${marcellus.className}`}>
        We Provide Solid Law Practice
      </h2>

      {/* Butonlar container */}
      <div className="absolute left-[1096px] top-[1061px] w-[567px] flex justify-center">
        {/* CALL US butonu */}
        <button className="w-[176px] h-[73px] bg-[#090B1E] rounded-[20px] rounded-tr-none rounded-br-none rounded-bl-none flex items-center justify-center gap-2">
          <Image
            src="/images/phone.svg"
            alt="Phone"
            width={22}
            height={22}
          />
          <span className={`text-white text-center text-[18px] font-normal leading-[52px] tracking-[1.44px] ${dmSans.className}`}>
            CALL US
          </span>
        </button>

        {/* Telefon numarası butonu */}
        <button className="w-[257px] h-[73px] bg-[#BA9881] rounded-[20px] rounded-tl-none rounded-tr-none rounded-bl-none flex items-center justify-center -ml-[1px]">
          <span className={`text-white text-[18px] font-normal leading-normal tracking-[2.7px] ${dmSans.className}`}>
            +(528) 456-7592
          </span>
        </button>
      </div>

      {/* ABOUT US başlığı */}
      <div className={`absolute left-[1078px] top-[109px] w-[494px] h-[130px] ${dmSans.className}`}>
        <span className="text-[#BA9881] text-[20px] font-normal leading-normal tracking-[1.6px]">ABOUT US</span>
      </div>

      {/* Sol dekoratif dikdörtgen */}
      <div 
        className="absolute left-[1039px] top-[114px] w-[25px] h-[17px] rounded-[10px] rounded-tr-none rounded-bl-none"
        style={{ background: 'linear-gradient(115deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)' }}
      />

      {/* Sağ dekoratif dikdörtgen */}
      <div 
        className="absolute left-[1197px] top-[114px] w-[25px] h-[17px] rounded-[10px] rounded-tr-none rounded-bl-none"
        style={{ background: 'linear-gradient(115deg, rgba(186, 152, 129, 0.00) 0%, #BA9881 100%)' }}
      />

      {/* We&apos;re Advocates başlığı */}
      <h2 className={`absolute left-[1059px] top-[146px] w-[600px] h-[114px] text-[#090B1E] text-[52px] font-normal leading-normal tracking-[0.884px] ${marcellus.className}`}>
        We&apos;re Advocates for Justice and Right
      </h2>

      {/* Dekoratif çizgi */}
      <div 
        className="absolute left-[1058px] top-[315px] w-[113px] h-[2px]"
        style={{ background: 'linear-gradient(90deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)' }}
      />

      {/* Açıklama metni */}
      <p className={`absolute left-[1058px] top-[351px] w-[600px] h-[114px] text-[#777] text-[20px] font-normal leading-[38px] ${dmSans.className}`}>
        We are dedicated advocates for justice and your legal rights. Our mission is to provide strong representation for individuals and businesses facing legal challenges.
      </p>
    </section>
  );
}; 