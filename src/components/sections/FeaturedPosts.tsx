'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LanguageContext } from '@/components/LanguageContext';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const categories = [
  {
    key: 'Şiirler',
    tr: 'Şiirler',
    en: 'Poems'
  },
  {
    key: 'Anılar ve Öyküler',
    tr: 'Anılar ve Öyküler',
    en: 'Memories and Stories'
  },
  {
    key: 'Denemeler',
    tr: 'Denemeler',
    en: 'Essays'
  },
  {
    key: 'İnovasyon ve Girişimcilik',
    tr: 'İnovasyon ve Girişimcilik',
    en: 'Innovation and Entrepreneurship'
  },
  {
    key: 'Tadımlar',
    tr: 'Tadımlar',
    en: 'Tastings'
  }
];

interface Writing {
  id: string;
  title: { tr: string; en: string };
  slug: string;
  excerpt: { tr: string; en: string };
  image_url: string;
  created_at: string;
  reading_time: number;
  category: string;
  tags: { tr: string[]; en: string[] } | null;
}

export const FeaturedPosts = () => {
  const { language } = useContext(LanguageContext);
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const locale = language === 'tr' ? tr : enUS;

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  useEffect(() => {
    async function fetchWritings() {
      try {
        const { data, error } = await supabase
          .from('writings')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setWritings(data || []);
      } catch (err) {
        console.error('Yazılar yüklenirken hata:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWritings();
  }, []);

  const getCategoryTranslation = (categoryKey: string) => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category[language] : categoryKey;
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
        <div className="container px-6 md:px-8 lg:px-12 xl:px-16 relative">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (writings.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
      {/* Arka plan animasyonu */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_var(--color-primary)_50%,_transparent_75%)] bg-[length:250%_250%] opacity-[0.03] animate-shimmer" />

      <div className="container px-6 md:px-8 lg:px-12 xl:px-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[var(--color-fg)]">
            Öne Çıkan{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[var(--color-primary)]">Yazılar</span>
              <motion.span
                className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-lg"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </span>
          </h2>
          <p className="text-[var(--color-fg)]/70 md:text-xl">
            {language === 'tr' 
              ? 'Teknoloji, yazılım geliştirme ve web tasarımı hakkında en son yazılarım'
              : 'Latest articles about technology, software development and web design'
            }
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {writings.map((writing, index) => (
                <motion.div
                  key={writing.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex-[0_0_350px] rounded-lg border bg-[var(--color-bg)] text-[var(--color-fg)] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-[var(--color-primary)]/20 group flex flex-col"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
                    <Image
                      src={writing.image_url}
                      alt={writing.title[language]}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/80 via-[var(--color-bg)]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-[#BFA4FF] dark:bg-[#7F5AF0] text-[var(--color-primary-fg)] text-xs font-medium rounded-full shadow-sm">
                      {getCategoryTranslation(writing.category)}
                    </div>
                  </div>
                  <div className="p-4 relative flex flex-col flex-1 min-h-0">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/0 via-[var(--color-primary)]/5 to-[var(--color-primary)]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <div className="mb-2 flex items-center justify-between text-sm text-[var(--color-fg)]/70 group-hover:text-[var(--color-fg)]/60 transition-colors">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(writing.created_at), 'd MMMM yyyy', { locale })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{writing.reading_time} {language === 'tr' ? 'dakika okuma' : 'min read'}</span>
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 text-[clamp(0.875rem,2vw,1.125rem)]">
                      {writing.title[language]}
                    </h3>
                    <p className="mb-4 text-sm text-[var(--color-fg)]/70 group-hover:text-[var(--color-fg)]/80 transition-colors line-clamp-2 flex-grow">
                      {writing.excerpt[language]}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm text-[var(--color-fg)]/70 group-hover:text-[var(--color-fg)]/60 transition-colors">
                        Uğur Şahan
                      </span>
                      <Button
                        asChild
                        variant="ghost"
                        className="group/button relative overflow-hidden text-[var(--color-primary)] hover:text-[var(--color-primary)]/80"
                      >
                        <Link href={`/writings/${writing.slug}`}>
                          <span className="relative z-10">
                            {language === 'tr' ? 'Devamını Oku' : 'Read More'}
                          </span>
                          <motion.span
                            className="absolute inset-0 bg-[var(--color-primary)]/10"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                          />
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            asChild
          >
            <Link href="/writings" className="group">
              {language === 'tr' ? 'Tüm Yazıları Gör' : 'View All Posts'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}; 