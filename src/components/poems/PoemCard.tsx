'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';
import { LanguageContext } from '@/components/LanguageContext';

interface PoemCardProps {
  id: string;
  title: { tr: string; en: string };
  slug: string;
  excerpt: { tr: string; en: string };
  image_url: string;
  created_at: string;
  reading_time: number;
  index: number;
}

export function PoemCard({
  id,
  title,
  slug,
  excerpt,
  image_url,
  created_at,
  reading_time,
  index
}: PoemCardProps) {
  const params = useParams();
  const { language } = useContext(LanguageContext);
  const dateLocale = language === 'tr' ? tr : enUS;
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const titleElement = titleRef.current;
      if (!titleElement) return;

      let fontSize = 24; // Başlangıç font boyutu (1.5rem)
      titleElement.style.fontSize = `${fontSize}px`;

      while (titleElement.scrollWidth > titleElement.clientWidth && fontSize > 14) {
        fontSize -= 1;
        titleElement.style.fontSize = `${fontSize}px`;
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [title, language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Görsel */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image_url}
          alt={title[language]}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* İçerik */}
      <div className="p-6 space-y-4">
        {/* Tarih ve Okuma Süresi */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={created_at}>
              {format(new Date(created_at), 'd MMMM yyyy', { locale: dateLocale })}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {language === 'tr' 
                ? `${reading_time} dakika okuma süresi`
                : `${reading_time} ${reading_time === 1 ? 'minute' : 'minutes'} read`
              }
            </span>
          </div>
        </div>

        {/* Başlık */}
        <h2 
          ref={titleRef}
          className="font-semibold text-foreground group-hover:text-primary transition-colors whitespace-nowrap"
        >
          {title[language]}
        </h2>

        {/* Özet */}
        <p className="text-muted-foreground line-clamp-3">
          {excerpt[language]}
        </p>

        {/* Alt Bilgi */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm font-medium text-muted-foreground">
            Uğur Şahan
          </span>
          <Link
            href={`/writings/${slug}`}
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "h-9 px-4 py-2 transition-colors"
            )}
          >
            {language === 'tr' ? 'Devamını Oku' : 'Read More'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 