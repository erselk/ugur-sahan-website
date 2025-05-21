import { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Admin Panel | Uğur Şahan',
  description: 'Admin panel yönetim arayüzü',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
} 