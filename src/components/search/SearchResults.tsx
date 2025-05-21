'use client';

import { useEffect, useState, useContext, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Loader2, Search, FileText, Clock, Calendar } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { LanguageContext } from '@/components/LanguageContext';
import { useTranslation } from "@/lib/i18n/useTranslation";
import Link from 'next/link';
import { Input } from "@/components/ui/input";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Writing {
  id: string;
  title: { tr: string; en: string };
  slug: { tr: string; en: string };
  excerpt: { tr: string; en: string };
  content: { tr: string; en: string };
  image_url: string;
  created_at: string;
  reading_time: number;
  category: string;
  tags: { tr: string[]; en: string[] } | null;
  views: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const locale = language === 'tr' ? tr : enUS;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  useEffect(() => {
    async function searchWritings() {
      if (!query) {
        setWritings([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('writings')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const searchResults = data.filter(writing => {
          const searchLower = query.toLowerCase();
          const tagsTr = Array.isArray(writing.tags?.tr) ? writing.tags.tr : [];
          const tagsEn = Array.isArray(writing.tags?.en) ? writing.tags.en : [];
          const searchableContent = [
            writing.title.tr,
            writing.title.en,
            writing.excerpt.tr,
            writing.excerpt.en,
            writing.content.tr,
            writing.content.en,
            ...tagsTr,
            ...tagsEn,
            writing.category
          ].filter(Boolean).join(' ').toLowerCase();
          return searchableContent.includes(searchLower);
        });

        setWritings(searchResults);
      } catch (err) {
        console.error('Arama sırasında hata:', err);
        setError(language === 'tr' 
          ? 'Arama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
          : 'An error occurred while searching. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    searchWritings();
  }, [query, language]);

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          {t("nav.writings")}
        </h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={language === 'tr' ? 'Yazılarda ara...' : 'Search in writings...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </form>
      </motion.div>

      {writings.length === 0 && !isLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-muted/50 rounded-lg"
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {language === 'tr' 
              ? 'Arama kriterlerinize uygun yazı bulunamadı.'
              : 'No writings found matching your search criteria.'
            }
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="initial"
          animate="animate"
          className="grid gap-4"
        >
          {writings.map((writing) => (
            <motion.div
              key={writing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-[480px] h-[270px]">
                  <img
                    src={writing.image_url}
                    alt={writing.title[language]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/writings/${writing.slug[language]}`}
                        className="block group"
                      >
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {writing.title[language]}
                        </h2>
                      </Link>
                      <p className="text-muted-foreground mb-4 line-clamp-1">
                        {writing.excerpt[language]}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {writing.reading_time} {language === 'tr' ? 'dakika' : 'min'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(writing.created_at), 'd MMMM yyyy', { locale })}
                        </span>
                        {writing.category && (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {writing.category}
                          </span>
                        )}
                      </div>
                      {writing.tags && writing.tags[language] && writing.tags[language].length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {writing.tags[language].map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 