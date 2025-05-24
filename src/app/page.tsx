import { Hero } from '@/components/Hero';
import Header from '@/components/Header';
import { AboutUs } from '@/components/AboutUs';
import { WhatWeDo } from '@/components/WhatWeDo';
import HowWeWork from '@/components/HowWeWork';
import RecentArticles from '@/components/RecentArticles';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutUs />
      <WhatWeDo />
      <HowWeWork />
      <RecentArticles />
      <Footer />
    </main>
  );
}
