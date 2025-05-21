'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Loader2, FileText, Plus, Edit2, Search, Clock, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Writing {
  id: number;
  title: { tr: string; en: string };
  slug: string;
  content: { tr: string; en: string };
  excerpt: { tr: string; en: string };
  created_at: string;
  updated_at: string;
  is_published: boolean;
  reading_time: number;
  views: number;
  category: string;
  tags: { tr: string[]; en: string[] } | null;
  image_url: string;
}

export default function WritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'Şiirler',
    'Anılar ve Öyküler',
    'Denemeler',
    'İnovasyon ve Girişimcilik',
    'Tadımlar'
  ];

  useEffect(() => {
    fetchWritings();
  }, []);

  const fetchWritings = async () => {
    try {
      const { data, error } = await supabase
        .from('writings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWritings(data || []);
    } catch (error) {
      console.error('Error fetching writings:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      writing.content.tr,
      writing.content.en,
      ...tagsTr,
      ...tagsEn,
      writing.category
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableContent.includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Yazılar
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-fg-muted)]" />
            <input
              type="text"
              placeholder="Yazılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent w-64"
            />
          </div>
          <Link
            href="/admin/writings/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Yazı</span>
          </Link>
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
        >
          Tümü
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sonuç Sayısı */}
      {searchQuery && (
        <p className="text-sm text-[var(--color-fg-muted)]">
          {filteredWritings.length} sonuç bulundu
        </p>
      )}

      <div className="grid gap-4">
        {filteredWritings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-[var(--color-bg-secondary)] rounded-lg"
          >
            <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--color-fg-muted)] opacity-50" />
            <p className="text-[var(--color-fg-muted)]">
              {searchQuery || selectedCategory
                ? 'Arama kriterlerinize uygun yazı bulunamadı.'
                : 'Henüz yazı bulunmuyor.'}
            </p>
          </motion.div>
        ) : (
          filteredWritings.map((writing) => (
            <motion.div
              key={writing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Görsel */}
                <div className="relative w-full md:w-48 h-48 md:h-auto">
                  <img
                    src={writing.image_url}
                    alt={writing.title.tr || writing.title.en}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* İçerik */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                        {writing.title.tr || writing.title.en}
                      </h2>
                      <p className="text-[var(--color-fg-muted)] mb-4 line-clamp-2">
                        {writing.excerpt.tr || writing.excerpt.en}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-fg-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {writing.reading_time} dakika
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {writing.views} görüntülenme
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(writing.created_at), 'd MMMM yyyy', { locale: tr })}
                        </span>
                        {writing.category && (
                          <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            {writing.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Aksiyonlar */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/writings/edit/${writing.id}`}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 