'use client';

import Link from 'next/link';
import { IoMdAdd } from 'react-icons/io';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import PracticeCard from './PracticeCard';

export const WhatWeDo = () => {
  const practiceAreas = [
    {
      image: '/images/divorce-1.webp',
      title: 'Health Care Law',
      description: 'Understanding Health Care Law: Regulations, Patient Rights, and..',
      backgroundImage: '/images/webp (2).webp'
    },
    {
      image: '/images/divorce-1.webp',
      title: 'Health Care Law',
      description: 'Understanding Health Care Law: Regulations, Patient Rights, and..',
      backgroundImage: '/images/webp (2).webp'
    },
    {
      image: '/images/divorce-1.webp',
      title: 'Health Care Law',
      description: 'Understanding Health Care Law: Regulations, Patient Rights, and..',
      backgroundImage: '/images/webp (2).webp'
    }
  ];

  return (
    <section className="w-[1920px] h-[1225px] bg-white relative">
      {/* Dekoratif dikdörtgenler */}
      <div className="absolute left-[573px] top-[79px] w-[25px] h-[17px] rounded-tr-[10px] rounded-bl-[10px] bg-gradient-to-br from-[#BA9881] to-transparent" />
      <div className="absolute left-[757px] top-[79px] w-[25px] h-[17px] rounded-tr-[10px] rounded-bl-[10px] bg-gradient-to-br from-transparent to-[#BA9881]" />

      {/* Başlık */}
      <div className="absolute left-[611px] top-[74px] text-[#BA9881] font-dm-sans text-[20px] font-normal tracking-[0.8px]">
        WHAT WE DO
      </div>

      {/* Ana başlık */}
      <h2 className="absolute left-[592px] top-[112px] w-[610px] text-[#090B1E] font-marcellus text-[53px] font-normal leading-[63px] tracking-[0.53px]">
        A Passion For Justice, Our Practice Areas
      </h2>

      {/* Alt çizgi */}
      <div className="absolute left-[592px] top-[276px] w-[113px] h-[2px] bg-gradient-to-r from-[#BA9881] to-transparent" />

      {/* Kartlar */}
      {/* İlk kart */}
      <div className="absolute left-[228px] top-[334px]">
        <PracticeCard
          image={practiceAreas[0].image}
          title={practiceAreas[0].title}
          description={practiceAreas[0].description}
          backgroundImage={practiceAreas[0].backgroundImage}
        />
      </div>

      {/* İkinci kart */}
      <div className="absolute left-[728px] top-[334px]">
        <PracticeCard
          image={practiceAreas[1].image}
          title={practiceAreas[1].title}
          description={practiceAreas[1].description}
          backgroundImage={practiceAreas[1].backgroundImage}
        />
      </div>

      {/* Üçüncü kart */}
      <div className="absolute left-[1228px] top-[334px]">
        <PracticeCard
          image={practiceAreas[2].image}
          title={practiceAreas[2].title}
          description={practiceAreas[2].description}
          backgroundImage={practiceAreas[2].backgroundImage}
        />
      </div>

      {/* Learn More butonu */}
      <div className="absolute left-[1407px] top-[166px] flex">
        <div className="w-[71px] h-[72px] bg-[#090B1E] rounded-tl-[20px] flex items-center justify-center">
          <IoMdAdd className="text-white text-3xl" />
        </div>
        <Link
          href="/practice-areas"
          className="w-[208px] h-[72px] bg-[#BA9881] rounded-br-[20px] flex items-center justify-center text-white font-dm-sans text-[19px] font-semibold tracking-[0.57px] hover:opacity-90 transition-opacity"
        >
          LEARN MORE
        </Link>
      </div>

      {/* Navigasyon okları */}
      <div className="absolute left-[1553px] top-[994px] flex gap-[25px]">
        <button className="w-[63px] h-[62px] bg-[#BA9881] rounded-tl-[20px] rounded-br-[20px] flex items-center justify-center hover:opacity-90 transition-opacity">
          <IoIosArrowBack className="text-white text-2xl" />
        </button>
        <button className="w-[63px] h-[62px] bg-[#BA9881] rounded-tr-[20px] rounded-bl-[20px] flex items-center justify-center hover:opacity-90 transition-opacity">
          <IoIosArrowForward className="text-white text-2xl" />
        </button>
      </div>
    </section>
  );
};

export default WhatWeDo; 