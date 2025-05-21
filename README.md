# Uğur Şahan Kişisel Web Sitesi

Modern, performanslı ve çok dilli kişisel web sitesi ve blog.

## Özellikler

- 🌐 Next.js 14 ile modern web uygulaması (Turbopack desteği)
- 🎨 Tailwind CSS ve ShadCN/ui ile modern UI
- 🌙 Karanlık/Aydınlık tema desteği
- 🔄 Framer Motion ile animasyonlar
- 🌍 Türkçe ve İngilizce dil desteği
- 📝 Microsoft Translator API ile otomatik çeviri
- 🔒 Supabase ile güvenli backend
- 📱 Tamamen responsive tasarım
- ⚡️ Yüksek performans ve SEO optimizasyonu
- 🚀 Turbopack ile hızlı geliştirme deneyimi
- [x] Çok dilli içerik desteği (Türkçe/İngilizce)
- [x] Otomatik içerik çevirisi (Microsoft Translator API)
- [x] Görsel yükleme ve otomatik WebP dönüştürme
- [x] Karanlık/Aydınlık tema desteği
- [x] Responsive tasarım
- [x] SEO optimizasyonu
- [x] Performans optimizasyonu
- [x] Güvenlik önlemleri
- [x] Şiirler sayfası (Modern kart tasarımı ve animasyonlar)
- [x] Anılar ve Öyküler sayfası (Modern kart tasarımı ve animasyonlar)
- [x] Denemeler sayfası (Modern kart tasarımı ve animasyonlar)
- [x] İnovasyon ve Girişimcilik sayfası (Modern kart tasarımı ve animasyonlar)
- [x] Tadımlar sayfası (Modern kart tasarımı ve animasyonlar)
- [x] Yazı detay sayfası
  - [x] Dinamik slug yapısı
  - [x] Çift dil desteği
  - [x] Görüntülenme sayacı
  - [x] Paylaşım özelliği
  - [x] Etiket sistemi
  - [x] Kategori gösterimi
  - [x] Okuma süresi
  - [x] Tarih gösterimi
  - [x] Zengin içerik formatı
- [x] Admin paneli
  - [x] Yazı ekleme/düzenleme/silme
  - [x] Otomatik çeviri desteği
  - [x] Görsel yükleme
  - [x] Kategori yönetimi
  - [x] Etiket yönetimi
- [x] Analytics entegrasyonu
- [ ] Projeler sayfası (Geliştirme aşamasında)
- [ ] Proje yönetim sistemi (Geliştirme aşamasında)
- [ ] İstatistik sistemi (Geliştirme aşamasında)

## Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, ShadCN/ui
- **Animasyon**: Framer Motion
- **Backend**: Supabase
- **Çeviri**: Microsoft Translator API
- **Paket Yöneticisi**: pnpm
- **Hosting**: Vercel
- **Build Tool**: Turbopack

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/ugur-sahan-website.git
cd ugur-sahan-website
```

2. Bağımlılıkları yükleyin:
```bash
pnpm install
```

3. Gerekli ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
MS_TRANSLATOR_API_KEY=your_translator_api_key
MS_TRANSLATOR_REGION=your_translator_region
```

5. Geliştirme sunucusunu başlatın (Turbopack ile):
```bash
pnpm dev
```

## Admin Paneli

Admin paneline `/admin` yolundan erişilebilir. Özellikler:

- 📝 Yazı yönetimi (ekleme, düzenleme, silme)
- 🌍 Çok dilli içerik yönetimi
- 🔄 Otomatik çeviri desteği
- 📊 İstatistikler ve analitikler (Geliştirme aşamasında)
- 📬 İletişim formu yönetimi
- 🚧 Proje yönetimi (Geliştirme aşamasında)

## Yazı Sistemi

Yazı sistemi aşağıdaki özellikleri içerir:

- 🌍 Türkçe ve İngilizce dil desteği
- 📅 Tarih ve saat seçimi
- 📑 Kategori yönetimi
- 📝 Başlık, özet ve içerik alanları
- 🏷️ Etiket sistemi
- 🖼️ Görsel yükleme ve WebP dönüşümü
- 🔄 Otomatik çeviri desteği

## Yazı Yönetimi

### Yazı Düzenleme
- Yazı düzenleme sayfası (`/admin/writings/edit/[id]`) aşağıdaki özelliklere sahiptir:
  - Mevcut yazı verilerini otomatik olarak getirme
  - Başlık, içerik, kategori, etiketler ve görsel düzenleme
  - Türkçe ve İngilizce dil desteği
  - Otomatik çeviri özelliği
  - Yazı silme özelliği (onay dialog'u ile)
  - Okuma süresi hesaplama
  - Görsel yükleme ve önizleme
  - Form doğrulama ve hata yönetimi
  - Oturum kontrolü ve güvenlik

## Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)

## Son Değişiklikler

- Slug yapısı güncellendi
  - Slug'lar artık tek bir İngilizce değer olarak tutulacak
  - Veritabanındaki `slug` alanı JSONB'den TEXT'e dönüştürüldü
  - Mevcut yazıların slug'ları otomatik olarak güncellendi
  - Yazı ekleme ve düzenleme sayfaları yeni slug yapısına uyarlandı
  - Tüm bileşenler ve sayfalar yeni slug yapısına göre güncellendi
  - Gerekli paketler yüklendi ve linter hataları düzeltildi
  - Slug oluşturma mantığı güncellendi:
    - Türkçe karakterler İngilizce karşılıklarına dönüştürülüyor
    - Büyük harfler küçük harfe çevriliyor
    - Özel karakterler tire (-) ile değiştiriliyor
    - Ardışık tireler tek tireye indirgeniyor
    - Baştaki ve sondaki tireler kaldırılıyor