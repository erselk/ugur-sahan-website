import { colors } from '@/styles/colors';

const UnderlineRectangle = () => {
  return (
    <div 
      className="absolute w-[25px] h-[22px]"
      style={{
        backgroundColor: colors.primary.brown,
        opacity: 0.4,
        borderRadius: '0 8px 0 8px',
        left: '302px',
        top: '98px',
        position: 'absolute'
      }}
    />
  );
};

export default UnderlineRectangle; 