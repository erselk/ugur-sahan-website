'use client';

import { useEffect, useState, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Clock, Calendar, Tag, ArrowLeft, Share2, Eye, Twitter, Facebook, Linkedin, Link as LinkIcon, Instagram } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/components/LanguageContext';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { toast } from 'sonner';
import { SiX } from 'react-icons/si';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Writing {
  id: string;
  title: { tr: string; en: string };
  slug: string;
  content: { tr: string; en: string };
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

export default function WritingPage() {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const params = useParams();
  const router = useRouter();
  const [writing, setWriting] = useState<Writing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dateLocale = language === 'tr' ? tr : enUS;

  useEffect(() => {
    async function fetchWriting() {
      try {
        // Slug ile yazıyı getir
        const { data, error } = await supabase
          .from('writings')
          .select('*')
          .eq('slug', params.slug)
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Supabase hatası:', error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error(language === 'tr' 
            ? 'Yazı bulunamadı'
            : 'Writing not found'
          );
        }

        setWriting(data);
      } catch (err) {
        console.error('Yazı yüklenirken hata:', err instanceof Error ? err.message : err);
        setError(language === 'tr' 
          ? 'Yazı yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
          : 'An error occurred while loading the writing. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (params.slug) {
      fetchWriting();
    }
  }, [params.slug, language]);

  const getCategoryTranslation = (categoryKey: string) => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category[language] : categoryKey;
  };

  const handleShare = async (platform: 'x' | 'facebook' | 'linkedin' | 'instagram') => {
    if (!writing) return;

    const shareText = language === 'tr' 
      ? `Uğur Şahan yazdı: ${writing.title[language]}\n\n`
      : `Written by Uğur Şahan: ${writing.title[language]}\n\n`;
    const shareUrl = window.location.href;
    const shareImage = writing.image_url;

    const shareLinks = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&picture=${encodeURIComponent(shareImage)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      instagram: `https://www.instagram.com/create/story?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareImage)}`
    };

    if (platform === 'instagram') {
      // Instagram için özel işlem
      try {
        await navigator.clipboard.writeText(`${shareText}${shareUrl}`);
        toast.success(language === 'tr' 
          ? 'Instagram için bağlantı kopyalandı! Görseli ve metni Instagram\'da paylaşabilirsiniz.'
          : 'Link copied for Instagram! You can share the image and text on Instagram.'
        );
      } catch (err) {
        toast.error(language === 'tr' ? 'Kopyalama başarısız!' : 'Copy failed!');
      }
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    if (!writing) return;

    const shareText = language === 'tr' 
      ? `Uğur Şahan yazdı: ${writing.title[language]}\n\n${window.location.href}`
      : `Written by Uğur Şahan: ${writing.title[language]}\n\n${window.location.href}`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(language === 'tr' ? 'Bağlantı kopyalandı!' : 'Link copied!');
    } catch (err) {
      toast.error(language === 'tr' ? 'Kopyalama başarısız!' : 'Copy failed!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !writing) {
    return (
      <div className="container max-w-[1920px] py-12 px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-destructive text-center">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.push('/writings')}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {language === 'tr' ? 'Yazılara Dön' : 'Back to Writings'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="container max-w-[1920px] py-12 px-6 md:px-8 lg:px-12">
      {/* Geri Dön Butonu */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/writings')}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {language === 'tr' ? 'Yazılara Dön' : 'Back to Writings'}
        </Button>
      </motion.div>

      {/* Başlık ve Meta Bilgiler */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-5xl mx-auto mb-12 space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
              {getCategoryTranslation(writing.category)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(writing.created_at), 'd MMMM yyyy', { locale: dateLocale })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {writing.reading_time} {language === 'tr' ? 'dakika okuma' : 'min read'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight">
            {writing.title[language]}
          </h1>
        </div>
      </motion.div>

      {/* Kapak Görseli */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative aspect-[21/9] w-full max-w-7xl mx-auto mb-12 rounded-xl overflow-hidden"
      >
        <Image
          src={writing.image_url}
          alt={writing.title[language]}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
        />
      </motion.div>

      {/* İçerik */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-5xl mx-auto prose prose-xl dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-p:whitespace-pre-line prose-p:leading-relaxed prose-p:text-xl"
      >
        <div dangerouslySetInnerHTML={{ 
          __html: writing.content[language].replace(/\n/g, '<br />') 
        }} />
      </motion.div>

      {/* Sosyal Medya Paylaşım */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-5xl mx-auto mt-12 pt-8 border-t"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-muted-foreground">
            {language === 'tr' ? 'Bu yazıyı paylaş:' : 'Share this article:'}
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare('x')}
              className="hover:bg-[#000000] hover:text-white dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
              title="X (Twitter)"
            >
              <SiX className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare('facebook')}
              className="hover:bg-[#1877F2] hover:text-white dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
              title="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare('linkedin')}
              className="hover:bg-[#0A66C2] hover:text-white dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare('instagram')}
              className="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:bg-none dark:hover:from-transparent dark:hover:via-transparent dark:hover:to-transparent transition-colors"
              title="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
              title={language === 'tr' ? 'Bağlantıyı Kopyala' : 'Copy Link'}
            >
              <LinkIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Etiketler */}
      {writing.tags && writing.tags[language]?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-8 pt-8 border-t"
        >
          <div className="flex flex-wrap gap-2">
            {writing.tags[language].map((tag, index) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </article>
  );
} 