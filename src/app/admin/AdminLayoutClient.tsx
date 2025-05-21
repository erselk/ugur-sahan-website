'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Login sayfasındaysak auth kontrolü yapma
        if (pathname === '/admin/login') {
          setIsLoading(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/admin/login');
          return;
        }

        if (!session) {
          router.push('/admin/login');
          return;
        }

        // Admin rolü kontrolü
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          router.push('/admin/login');
          return;
        }

        if (profile?.role !== 'admin') {
          console.error('User is not an admin');
          router.push('/admin/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          <p className="text-[var(--color-fg)]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Login sayfasındaysak sadece içeriği göster
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 