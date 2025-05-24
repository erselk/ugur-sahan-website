'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'A World Class Packaging Team, Built for You',
    image: '/images/webp (3).webp',
    category: 'Packaging',
    date: 'JULY 19, 2024',
  },
  {
    id: 2,
    title: 'Making Innovative Business Strategies',
    image: '/images/webp (4).webp',
    category: 'Strategy',
    date: 'JULY 18, 2024',
  },
  {
    id: 3,
    title: 'How To Become Practical In House Lawyer',
    image: '/images/webp (6).webp',
    category: 'Law',
    date: 'JULY 17, 2024',
  },
];

const featuredPost = {
  title: 'Discover A Better Way Of Redefining Company',
  image: '/images/webp (5).webp',
  category: 'FAMILY,LAWYER',
  date: 'JULY 19, 2024',
};

export default function RecentArticles() {
  return (
    <section className="relative w-[1920px] h-[1044px] bg-white overflow-hidden">
      <div className="relative pt-8">
        <div className="absolute left-[819px] top-[47px] flex items-center">
          <div 
            className="w-[25px] h-[17px] flex-shrink-0"
            style={{ 
              borderRadius: '0 10px 0 10px',
              background: 'linear-gradient(115deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)'
            }}
          />
          <h2 className="mx-4 text-[#BA9881] font-dm-sans text-[18px] font-normal leading-normal tracking-[1.98px]">
            RECENT ARTICLES
          </h2>
          <div 
            className="w-[25px] h-[17px] flex-shrink-0"
            style={{ 
              borderRadius: '0 10px 0 10px',
              background: 'linear-gradient(115deg, rgba(186, 152, 129, 0.00) 0%, #BA9881 100%)'
            }}
          />
        </div>

        <h1 className="absolute left-[757px] top-[79px] font-marcellus text-[52px] font-normal leading-normal text-[#090B1E] tracking-[1.04px]">
          Latest Blog Post
        </h1>

        <div 
          className="absolute left-[895px] top-[181px] w-[113px] h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)'
          }}
        />
      </div>

      <div className="relative mt-[160px]">
        <div className="absolute left-[217px] space-y-[100px]">
          {blogPosts.slice(0, 2).map((post) => (
            <div key={post.id}>
              <div className="relative w-[342px] h-[191px] mb-4 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  style={{ borderRadius: '37px 0 0 0' }}
                />
              </div>
              <h3 className="w-[248px] font-marcellus text-[25px] text-[#090B1E] leading-[37px]">
                {post.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="absolute left-[598px] top-0">
          <div className="relative w-[695px] h-[625px]">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="absolute left-[1338px] top-0">
          <div className="relative w-[330px] h-[266px] mb-4 overflow-hidden">
            <Image
              src={blogPosts[2].image}
              alt={blogPosts[2].title}
              fill
              className="object-cover"
              style={{ borderRadius: '37px 0 0 0' }}
            />
          </div>
          <h3 className="w-[330px] font-marcellus text-[25px] text-[#090B1E] leading-[37px]">
            {blogPosts[2].title}
          </h3>
        </div>

        <div className="absolute left-[1334px] top-[397px]">
          <div 
            className="relative w-[338px] h-[225px] bg-[#BA9881]"
            style={{ borderRadius: '0 60px 0 60px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <h3 className="w-[231px] text-white font-dm-sans text-[30px] font-semibold leading-[40px] text-center">
                What News Do We Have Today, Latest Blog
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[598px] top-[585px] w-[651px] h-[271px] bg-white">
        <div className="relative h-full">
          <p className="absolute left-[43px] top-[39px] text-[#777] font-dm-sans text-[18px] font-normal leading-[23px] tracking-[1.26px]">
            {featuredPost.category}
          </p>
          <h3 className="absolute left-[45px] top-[77px] w-[447px] font-marcellus text-[35px] font-normal leading-[48px] text-[#090B1E]">
            {featuredPost.title}
          </h3>
          <div className="absolute left-[45px] top-[191px] flex items-center gap-2">
            <Link 
              href="#" 
              className="text-[#BA9881] font-dm-sans text-[20px] font-normal leading-[48px] tracking-[0.2px]"
            >
              LEARN MORE
            </Link>
            <div className="absolute left-[134px] top-[13px] w-[22px] h-[22px]">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5V17M5 11H17" stroke="#BA9881" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="absolute left-[1149px] top-[534px] w-[100px] h-[100px] bg-[#BA9881] flex items-center justify-center"
        style={{ borderRadius: '25px 0 0 0' }}
      >
        <p className="w-[54px] text-white font-dm-sans text-[18px] font-normal leading-[23px] tracking-[1.98px] text-center">
          {featuredPost.date}
        </p>
      </div>
    </section>
  );
} 