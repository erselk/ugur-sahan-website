'use client';

import { useEffect, useState, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PoemCard } from '@/components/poems/PoemCard';
import { LanguageContext } from '@/components/LanguageContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Writing {
  id: string;
  title: { tr: string; en: string };
  slug: string;
  excerpt: { tr: string; en: string };
  image_url: string;
  created_at: string;
  reading_time: number;
}

export default function MemoriesPage() {
  const { language } = useContext(LanguageContext);
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const { data, error } = await supabase
          .from('writings')
          .select('*')
          .eq('category', 'Anılar ve Öyküler')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setWritings(data || []);
      } catch (err) {
        console.error('Yazılar yüklenirken hata:', err);
        setError(language === 'tr' 
          ? 'Yazılar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
          : 'An error occurred while loading writings. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchWritings();
  }, [language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive text-center">{error}</p>
      </div>
    );
  }

  if (writings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-center">
          {language === 'tr' 
            ? 'Henüz anı veya öykü bulunmamaktadır.'
            : 'No memories or stories found yet.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-[1920px] py-12 px-6 md:px-8 lg:px-12 space-y-12">
      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          {language === 'tr' ? 'Anılar ve Öyküler' : 'Memories & Stories'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {language === 'tr' 
            ? 'Uğur Şahan\'ın kaleminden dökülen anılar ve öyküler...'
            : 'Memories and stories flowing from Uğur Şahan\'s pen...'
          }
        </p>
      </motion.div>

      {/* Yazı Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-[1800px]">
        {writings.map((writing, index) => (
          <PoemCard
            key={writing.id}
            {...writing}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}