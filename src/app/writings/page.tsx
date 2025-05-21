"use client";

import { useEffect, useState, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Loader2, Search, FileText } from 'lucide-react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LanguageContext } from '@/components/LanguageContext';
import { PoemCard } from '@/components/poems/PoemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  category: string;
  tags: { tr: string[]; en: string[] } | null;
}

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WritingsPage() {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWritings() {
      try {
        const { data, error } = await supabase
          .from('writings')
          .select('*')
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

  const filteredWritings = writings.filter(writing => {
    // Kategori filtresi
    if (selectedCategory && writing.category !== selectedCategory) {
      return false;
    }

    // Arama filtresi
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    
    // Tags array'lerini güvenli bir şekilde birleştir
    const tagsTr = Array.isArray(writing.tags?.tr) ? writing.tags.tr : [];
    const tagsEn = Array.isArray(writing.tags?.en) ? writing.tags.en : [];
    
    const searchableContent = [
      writing.title.tr,
      writing.title.en,
      writing.excerpt.tr,
      writing.excerpt.en,
      ...tagsTr,
      ...tagsEn,
      writing.category
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableContent.includes(searchLower);
  });

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
          {t("nav.writings")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("home.description")}
        </p>
      </motion.div>

      {/* Filtreler ve Arama */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {/* Filtreler ve Arama */}
        <div className="relative flex items-center min-h-[40px]">
          {/* Kategori Filtreleri - Tam Ortada */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-nowrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="text-sm shrink-0"
            >
              {language === 'tr' ? 'Tümü' : 'All'}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.key)}
                className="text-sm shrink-0"
              >
                {language === 'tr' ? category.tr : category.en}
              </Button>
            ))}
          </div>

          {/* Arama - Sağda */}
          <div className="absolute right-0 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === 'tr' ? 'Yazılarda ara...' : 'Search in writings...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Sonuç Sayısı */}
        {searchQuery && (
          <p className="text-sm text-muted-foreground text-center">
            {language === 'tr' 
              ? `${filteredWritings.length} sonuç bulundu`
              : `Found ${filteredWritings.length} results`
            }
          </p>
        )}
      </motion.div>

      {/* Yazı Kartları */}
      {filteredWritings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-muted/50 rounded-lg"
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory
              ? (language === 'tr' 
                ? 'Arama kriterlerinize uygun yazı bulunamadı.'
                : 'No writings found matching your search criteria.')
              : (language === 'tr'
                ? 'Henüz yazı bulunmuyor.'
                : 'No writings found yet.')
            }
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-[1800px]"
        >
          {filteredWritings.map((writing, index) => (
            <PoemCard
              key={writing.id}
              {...writing}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
} 