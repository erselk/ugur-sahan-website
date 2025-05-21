-- Yazılar tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL, -- {tr: string, en: string}
  slug JSONB NOT NULL, -- {tr: string, en: string}
  excerpt JSONB, -- {tr: string, en: string}
  content JSONB NOT NULL, -- {tr: string, en: string}
  category TEXT NOT NULL CHECK (category IN ('Şiirler', 'Anılar ve Öyküler', 'Denemeler', 'İnovasyon ve Girişimcilik', 'Tadımlar')),
  tags JSONB, -- {tr: string[], en: string[]}
  image_url TEXT NOT NULL DEFAULT '/ugursahan.webp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  reading_time INTEGER, -- dakika cinsinden
  author_id UUID REFERENCES auth.users(id) NOT NULL
);

-- RLS politikalarını etkinleştir
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Herkesin yayınlanmış yazıları okumasına izin ver
CREATE POLICY "Yayınlanmış yazıları herkes okuyabilir" ON public.posts
  FOR SELECT USING (is_published = true);

-- Sadece admin rolüne sahip kullanıcıların yazıları yönetmesine izin ver
CREATE POLICY "Adminler yazıları yönetebilir" ON public.posts
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Güncelleme zamanını otomatik güncelle
CREATE TRIGGER on_posts_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Slug'ların benzersiz olmasını sağla
CREATE UNIQUE INDEX posts_slug_tr_unique ON public.posts ((slug->>'tr'));
CREATE UNIQUE INDEX posts_slug_en_unique ON public.posts ((slug->>'en')); 