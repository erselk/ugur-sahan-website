'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  Home
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Mesajlar',
    href: '/admin/messages',
    icon: MessageSquare
  },
  {
    title: 'Yazılar',
    href: '/admin/writings',
    icon: FileText
  },
  {
    title: 'Projeler',
    href: '/admin/projects',
    icon: Briefcase
  },
  {
    title: 'İstatistikler',
    href: '/admin/stats',
    icon: BarChart3
  },
  {
    title: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="h-screen w-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link 
            href="/admin" 
            className="text-2xl font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            Admin Panel
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                    : 'text-[var(--color-fg)] hover:bg-[var(--color-bg-hover)] hover:translate-x-1'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Siteye Dön Butonu */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-3 text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)] rounded-lg transition-all duration-300 hover:translate-x-1"
          >
            <Home className="w-5 h-5" />
            <span>Siteye Dön</span>
          </Link>
        </div>
      </div>
    </aside>
  );
} 