import React from 'react';
import { FaBell } from 'react-icons/fa';

interface WorkCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}

const WorkCard: React.FC<WorkCardProps> = ({ title, description, icon, style }) => {
  return (
    <div 
      className="w-[438px] h-[405px] border border-[#E0E0E0] p-8 relative" 
      style={{
        ...style,
        borderTopLeftRadius: '37px',
        borderBottomRightRadius: '37px',
      }}
    >
      <div className="w-[95px] h-[95px] rounded-full bg-[#BA9881] flex items-center justify-center mx-auto mb-8">
        {icon}
      </div>
      <h3 className="text-white font-marcellus text-[33px] font-normal tracking-[-0.33px] mb-4">
        {title}
      </h3>
      <p className="text-white font-dm-sans text-xl font-normal leading-[37px]">
        {description}
      </p>
    </div>
  );
};

const HowWeWork: React.FC = () => {
  return (
    <section className="w-[1920px] h-[839px] bg-[#090B1E] relative">
      <div className="relative w-full h-full">
        {/* EASY TO CONNECT US başlığı ve dekoratif dikdörtgenler */}
        <div className="absolute left-[795px] top-[146px] w-[25px] h-[17px] rounded-tr-[10deg] rounded-bl-[10deg] bg-gradient-to-br from-[#BA9881] to-transparent" />
        <span className="absolute left-[834px] top-[141px] text-[#BA9881] font-dm-sans text-xl font-normal tracking-[1.6px]">
          EASY TO CONNECT US
        </span>
        <div className="absolute left-[1080px] top-[146px] w-[25px] h-[17px] rounded-tr-[10deg] rounded-bl-[10deg] bg-gradient-to-br from-transparent to-[#BA9881]" />

        {/* How We Work Process başlığı */}
        <h2 className="absolute left-[677px] top-[179px] text-white font-marcellus text-[53px] font-normal tracking-[0.53px]">
          How We Work Process
        </h2>

        {/* Kartlar */}
        <WorkCard
          title="Business Security"
          description="We provide expert legal guidance to safeguard businesses against fraud, disputes, and regulatory challenges."
          icon={<FaBell className="w-9 h-9 text-white" style={{ width: '36px', height: '36px' }} />}
          style={{ position: 'absolute', left: '244px', top: '296px' }}
        />
        <WorkCard
          title="Business Security"
          description="We provide expert legal guidance to safeguard businesses against fraud, disputes, and regulatory challenges."
          icon={<FaBell className="w-9 h-9 text-white" style={{ width: '36px', height: '36px' }} />}
          style={{ position: 'absolute', left: '733px', top: '296px' }}
        />
        <WorkCard
          title="Business Security"
          description="We provide expert legal guidance to safeguard businesses against fraud, disputes, and regulatory challenges."
          icon={<FaBell className="w-9 h-9 text-white" style={{ width: '36px', height: '36px' }} />}
          style={{ position: 'absolute', left: '1222px', top: '296px' }}
        />
      </div>
    </section>
  );
};

export default HowWeWork; 