'use client';

import Image from 'next/image';

interface PracticeCardProps {
  image: string;
  title: string;
  description: string;
  backgroundImage: string;
}

export const PracticeCard = ({ image, title, description, backgroundImage }: PracticeCardProps) => {
  return (
    <div className="w-[463px] h-[586px] relative">
      {/* İkon */}
      <div className="absolute left-[35px] top-[44px] w-[77px] h-[90px]">
        <Image
          src={image}
          alt={title}
          width={77}
          height={90}
          className="object-contain"
        />
      </div>

      {/* Başlık */}
      <h3 className="absolute left-[37px] top-[148px] text-[#090B1E] font-marcellus text-[40px] font-normal leading-[63px] tracking-[-1.2px]">
        {title}
      </h3>

      {/* Açıklama */}
      <p className="absolute left-[38px] top-[221px] w-[296px] text-[#090B1E] font-dm-sans text-[20px] font-normal leading-[38px]">
        {description}
      </p>

      {/* Dekoratif dikdörtgen */}
      <div 
        className="absolute left-[416px] top-0 w-[47px] h-[125px] rounded-bl-[37px]"
        style={{ background: 'linear-gradient(270deg, rgba(186, 152, 129, 0.70) 0%, rgba(186, 152, 129, 0.00) 100%)' }}
      />

      {/* Arka plan resmi */}
      <div className="absolute left-0 bottom-0 w-[463px] h-[249px]">
        <Image
          src={backgroundImage}
          alt="Background"
          width={463}
          height={249}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default PracticeCard; 