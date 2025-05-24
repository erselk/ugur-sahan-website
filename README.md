# Igual Website

Modern ve performans odaklı bir web sitesi projesi.

## Teknolojiler

- Next.js (App Router)
- Supabase
- Tailwind CSS
- pnpm
- TypeScript

## Renk Paleti

- Beyaz: #FFFFFF
- Kahverengi: #BA9881
- Açık Gri: #E0E0E0
- Koyu Mavi: #090B1E

## Bileşenler

### Header
- Responsive navigasyon menüsü
- İletişim bilgileri
- Logo alanı

### Hero
- Tam ekran hero bölümü
- Profesyonel fotoğraf
- Ana başlık ve alt başlık
- İletişim butonu

### AboutUs
- Hakkımızda bölümü
- Profesyonel fotoğraflar
- Alıntı metni
- İletişim butonları

### WhatWeDo
- Hizmet alanları bölümü
- Dekoratif dikdörtgenler
- Ana başlık ve alt başlık
- Learn More butonu
- Navigasyon okları

## Recent Articles Bileşeni

Recent Articles bileşeni, blog yazılarını ve öne çıkan içeriği görüntülemek için kullanılan bir bileşendir. Bileşen şu özellikleri içerir:

- "RECENT ARTICLES" başlığı ve dekoratif gradyan dikdörtgenler
- "Latest Blog Post" ana başlığı
- Öne çıkan büyük blog yazısı (featured post)
- 3 adet küçük blog yazısı grid'i
- Newsletter kutusu

### Gerekli Görseller

Aşağıdaki görsellerin `public/images` dizinine eklenmesi gerekmektedir:

- webp (3).webp (342x191)
- webp (4).webp (342x228)
- webp (5).webp (695x625)
- webp (6).webp (330x266)

### Kullanım

```tsx
import RecentArticles from '@/components/RecentArticles';

export default function Page() {
  return <RecentArticles />;
}
```

## Kurulum

```bash
pnpm install
pnpm dev
```

## Özellikler

- Modern ve performans odaklı tasarım
- Responsive layout
- Merkezi renk yönetimi
- DM Sans ve Marcellus font entegrasyonu
- SVG ikonlar
- TypeScript ile tip güvenliği
- Supabase storage entegrasyonu (next.config.js ile yapılandırılmış)

## Yapılandırma

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['polhsjatjhxjlswbbzta.supabase.co'], // Supabase storage domain'i
  },
}

module.exports = nextConfig
```

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
