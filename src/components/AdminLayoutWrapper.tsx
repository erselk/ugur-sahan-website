'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
} 