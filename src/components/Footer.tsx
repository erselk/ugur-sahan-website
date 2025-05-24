'use client';

import Image from 'next/image';
import { MdEmail, MdLanguage, MdSend } from 'react-icons/md';
import { FaLinkedin, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';
import { IoIosArrowForward } from 'react-icons/io';

export const Footer = () => {
  return (
    <footer className="w-[1920px] h-[920px] bg-[#090B1E] relative">
      <div className="absolute left-0 top-0">
        <Image
          src="/images/triangle.svg"
          alt="Triangle decoration"
          width={199}
          height={382}
          className="object-contain"
        />
      </div>

      <div className="relative w-full h-full">
        {/* Üst Kısım - Mevcut Kod */}
        {/* GET IN TOUCH Text */}
        <p className="absolute left-[264px] top-[94px] text-[#BA9881] font-dm-sans text-lg tracking-[1.98px]">
          GET IN TOUCH
        </p>

        {/* Decorative Rectangles */}
        <div className="absolute left-[224px] top-[97px] w-[25px] h-[17px] rounded-tr-[10px] rounded-bl-[10px] bg-gradient-to-br from-[#BA9881] to-transparent" />
        <div className="absolute left-[418px] top-[97px] w-[25px] h-[17px] rounded-tr-[10px] rounded-bl-[10px] bg-gradient-to-br from-transparent to-[#BA9881]" />

        {/* Main Heading */}
        <h2 className="absolute left-[224px] top-[130px] w-[780px] text-white font-marcellus text-[50px] leading-[70px]">
          Let&apos;s Get Started With Us, Further Info & Support Team
        </h2>

        {/* Phone Section */}
        <div className="absolute left-[1233px] top-[94px] w-[454px] h-[170px]">
          <div 
            className="relative w-full h-full rounded-tl-[65px]"
            style={{
              background: 'linear-gradient(103deg, #BA9881 10.76%, rgba(186, 152, 129, 0.00) 92.26%)'
            }}
          >
            {/* Call Us Text */}
            <p className="absolute left-[122px] top-[108px] text-white font-dm-sans text-xl">
              FEEL FREE TO CALL US
            </p>

            {/* Phone Number */}
            <p className="absolute left-[63px] top-[36px] text-white font-marcellus text-[45px] tracking-[0.45px]">
              +(528) 456-7592
            </p>
          </div>
        </div>

        {/* Alt Kısım - Yeni Eklenen */}
        {/* Our Address */}
        <h3 className="absolute left-[219px] top-[464px] text-white font-marcellus text-[27px] leading-[70px] tracking-[-0.27px]">
          Our Address
        </h3>
        <div className="absolute left-[385px] top-[497px] w-[60px] h-[3px] bg-gradient-to-r from-[#BA9881] to-transparent" />
        <p className="absolute left-[219px] top-[544px] w-[344px] text-[#E0E0E0] font-dm-sans text-xl leading-[41px]">
          4821 Ridge Top Cir, Anchorage Street, Alaska 99508, United States America.
        </p>

        {/* Connect with Us */}
        <h3 className="absolute left-[594px] top-[464px] text-white font-marcellus text-[27px] leading-[70px] tracking-[-0.27px]">
          Connect with Us
        </h3>
        <div className="absolute left-[808px] top-[497px] w-[60px] h-[3px] bg-gradient-to-r from-[#BA9881] to-transparent" />
        
        {/* Email ve Fax */}
        <div className="absolute left-[592px] top-[552px] flex items-center">
          <MdEmail className="w-[24px] h-[24px] text-[#BA9881] mr-[14px]" />
          <p className="text-[#E0E0E0] font-dm-sans text-xl">info@example.com</p>
        </div>
        <div className="absolute left-[592px] top-[600px] flex items-center">
          <MdEmail className="w-[24px] h-[24px] text-[#BA9881] mr-[14px]" />
          <p className="text-[#E0E0E0] font-dm-sans text-xl">support@igual.com</p>
        </div>
        <div className="absolute left-[592px] top-[650px] flex items-center">
          <MdLanguage className="w-[24px] h-[24px] text-[#BA9881] mr-[14px]" />
          <p className="text-[#E0E0E0] font-dm-sans text-xl">FAX - 555-123-4567</p>
        </div>

        {/* Quicklinks */}
        <h3 className="absolute left-[924px] top-[464px] text-white font-marcellus text-[27px] leading-[70px] tracking-[-0.27px]">
          Quicklinks
        </h3>
        <div className="absolute left-[1060px] top-[497px] w-[60px] h-[3px] bg-gradient-to-r from-[#BA9881] to-transparent" />
        
        {/* Quicklinks Items */}
        <div className="absolute left-[920px] top-[548px] flex items-center">
          <IoIosArrowForward className="w-[27px] h-[27px] text-[#BA9881] mr-[5px]" />
          <p className="text-[#E0E0E0] font-dm-sans text-xl leading-[40px]">Blog</p>
        </div>
        <div className="absolute left-[920px] top-[594px] flex items-center">
          <IoIosArrowForward className="w-[27px] h-[27px] text-[#BA9881] mr-[5px]" />
          <p className="text-[#E0E0E0] font-dm-sans text-xl leading-[40px]">About Us</p>
        </div>
        <div className="absolute left-[920px] top-[640px] flex items-center">
          <IoIosArrowForward className="w-[27px] h-[27px] text-[#BA9881] mr-[5px]" />
          <p className="text-[#E0E0E0] font-dm-sans text-xl leading-[40px]">Contact Us</p>
        </div>

        {/* Our Newsletter */}
        <h3 className="absolute left-[1238px] top-[465px] text-white font-marcellus text-[27px] leading-[70px] tracking-[-0.27px]">
          Our Newsletter
        </h3>
        <div className="absolute left-[1440px] top-[498px] w-[60px] h-[3px] bg-gradient-to-r from-[#BA9881] to-transparent" />
        <p className="absolute left-[1238px] top-[549px] text-[#E0E0E0] font-dm-sans text-xl leading-[40px]">
          Signup for our latest news & articles.
        </p>
        <p className="absolute left-[1238px] top-[608px] text-[#E0E0E0] font-dm-sans text-xl leading-[40px]">
          Email Address
        </p>
        <div className="absolute left-[1238px] top-[648px] w-[443px] h-[1px] bg-[#777777]" />
        <div className="absolute left-[1660px] top-[617px]">
          <MdSend className="w-[21px] h-[21px] text-[#BA9881]" />
        </div>

        {/* Copyright */}
        <p className="absolute left-[219px] top-[839px] text-[#E0E0E0] font-dm-sans text-xl leading-[40px]">
          © Copyright 2025. All rights reserved.
        </p>

        {/* Social Media Icons */}
        <div className="absolute left-[1475px] top-[848px] flex gap-[25px]">
          <FaLinkedin className="w-[22px] h-[22px] text-white" />
          <SiBluesky className="w-[22px] h-[22px] text-white" />
          <FaXTwitter className="w-[22px] h-[22px] text-white" />
          <FaInstagram className="w-[22px] h-[22px] text-white" />
        </div>
      </div>
    </footer>
  );
};