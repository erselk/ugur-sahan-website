'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  MessageSquare,
  FileText,
  Users,
  Eye,
  TrendingUp,
  Loader2
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DashboardStats = {
  totalMessages: number;
  unreadMessages: number;
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  monthlyViews: number;
};

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mesaj istatistikleri
        const { count: totalMessages } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });

        const { count: unreadMessages } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        // Blog yazıları istatistikleri
        const { count: totalPosts } = await supabase
          .from('writings')
          .select('*', { count: 'exact', head: true });

        const { count: publishedPosts } = await supabase
          .from('writings')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true);

        // Görüntülenme istatistikleri (örnek veriler)
        const totalViews = 1234;
        const monthlyViews = 234;

        setStats({
          totalMessages: totalMessages || 0,
          unreadMessages: unreadMessages || 0,
          totalPosts: totalPosts || 0,
          publishedPosts: publishedPosts || 0,
          totalViews,
          monthlyViews
        });
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Toplam Mesaj',
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      bgColor: 'bg-[var(--color-primary)]'
    },
    {
      title: 'Okunmamış Mesaj',
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      bgColor: 'bg-red-500'
    },
    {
      title: 'Toplam Yazı',
      value: stats?.totalPosts || 0,
      icon: FileText,
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Yayında',
      value: stats?.publishedPosts || 0,
      icon: FileText,
      bgColor: 'bg-green-500'
    },
    {
      title: 'Toplam Görüntülenme',
      value: stats?.totalViews || 0,
      icon: Eye,
      bgColor: 'bg-orange-500'
    },
    {
      title: 'Aylık Görüntülenme',
      value: stats?.monthlyViews || 0,
      icon: TrendingUp,
      bgColor: 'bg-pink-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-fg)] mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--color-fg-secondary)]">
          Hoş geldiniz! İşte sitenizin genel durumu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--color-bg-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[var(--color-fg)]">
                {card.title}
              </h3>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--color-fg)]">
              {card.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Son Aktiviteler */}
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border)]">
        <h2 className="text-xl font-bold text-[var(--color-fg)] mb-4">
          Son Aktiviteler
        </h2>
        <div className="space-y-4">
          {/* Burada son aktiviteler listelenecek */}
          <p className="text-[var(--color-fg-secondary)] text-center py-8">
            Yakında burada son aktiviteler görüntülenecek.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 