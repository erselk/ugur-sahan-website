'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { format, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar, Clock, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';
import { translateText } from '@/lib/translate';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const categories = [
  'Şiirler',
  'Anılar ve Öyküler',
  'Denemeler',
  'İnovasyon ve Girişimcilik',
  'Tadımlar'
];

interface PostData {
  title: { [key: string]: string };
  content: { [key: string]: string };
  excerpt: { [key: string]: string };
  category: string;
  tags: { [key: string]: string[] } | null;
  image_url: string;
  created_at: string;
  author_id: string;
  reading_time: number;
  slug: string;
}

interface FormDataState {
  title: { [key: string]: string };
  content: { [key: string]: string };
  excerpt: { [key: string]: string };
  category: string;
  tags: { [key: string]: string[] };
  image_url: string;
  created_at: string;
  reading_time: string;
}

export default function NewWritingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [shouldTranslate, setShouldTranslate] = useState<boolean>(false);
  const [sourceLanguage, setSourceLanguage] = useState<'tr' | 'en'>('tr');
  const targetLanguage = sourceLanguage === 'tr' ? 'en' : 'tr';
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<{ source: string[], target: string[] }>({ source: [], target: [] });
  const [formData, setFormData] = useState<FormDataState>({
    title: { tr: '', en: '' },
    content: { tr: '', en: '' },
    category: '',
    tags: { tr: [], en: [] },
    image_url: '/ugursahan.webp',
    created_at: format(new Date(), 'dd.MM.yyyy'),
    excerpt: { tr: '', en: '' },
    reading_time: ''
  });

  // Oturum kontrolü
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          if (mounted) {
            toast.error('Oturum hatası: ' + error.message);
            router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
          }
          return;
        }

        if (!session) {
          if (mounted) {
            toast.error('Oturum açmanız gerekiyor');
            router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          toast.error('Oturum kontrolü sırasında bir hata oluştu');
          router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
        }
      }
    };

    checkAuth();

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
        } else if (event === 'SIGNED_IN') {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  // Oturum kontrolü yapılırken loading göster
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Oturum yoksa null dön (yönlendirme useEffect içinde yapılıyor)
  if (!isAuthenticated) {
    return null;
  }

  // Tarih formatını dönüştüren yardımcı fonksiyonlar
  const formatDateForInput = (dateStr: string) => {
    try {
      console.log('formatDateForInput giriş:', dateStr);
      // ISO 8601 formatındaki tarihi parse et
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Geçersiz tarih');
      }
      const formatted = format(date, 'yyyy-MM-dd');
      console.log('formatDateForInput çıkış:', formatted);
      return formatted;
    } catch (error) {
      console.error('formatDateForInput hatası:', error);
      // Hata durumunda GG.AA.YYYY formatındaki tarihi parse etmeyi dene
      try {
        const date = parse(dateStr, 'dd.MM.yyyy', new Date());
        return format(date, 'yyyy-MM-dd');
      } catch {
        return dateStr;
      }
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    try {
      console.log('formatDateForDisplay giriş:', dateStr);
      // ISO 8601 formatındaki tarihi parse et
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Geçersiz tarih');
      }
      const formatted = format(date, 'dd.MM.yyyy');
      console.log('formatDateForDisplay çıkış:', formatted);
      return formatted;
    } catch (error) {
      console.error('formatDateForDisplay hatası:', error);
      // Hata durumunda yyyy-MM-dd formatındaki tarihi parse etmeyi dene
      try {
        const date = parse(dateStr, 'yyyy-MM-dd', new Date());
        return format(date, 'dd.MM.yyyy');
      } catch {
        return dateStr;
      }
    }
  };

  // Okuma süresini hesapla
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Ortalama okuma hızı
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute); // Yukarı yuvarla
    return readingTime;
  };

  const handleSubmit = async (e: React.FormEvent, shouldTranslateParam: boolean = false) => {
    e.preventDefault();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      toast.error('Oturum geçersiz veya süresi dolmuş');
      router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
      return;
    }

    const requiredFieldsLabels = {
      title: 'Başlık',
      content: 'İçerik',
      category: 'Kategori',
      reading_time: 'Okuma süresi'
    };

    // Kaynak dildeki zorunlu alanları kontrol et
    const missingFieldsSource = [];
    if (!formData.title[sourceLanguage]) {
      missingFieldsSource.push(requiredFieldsLabels.title);
    }
    if (!formData.content[sourceLanguage]) {
      missingFieldsSource.push(requiredFieldsLabels.content);
    }
    if (!formData.category) {
      missingFieldsSource.push(requiredFieldsLabels.category);
    }
    if (!formData.reading_time || parseFloat(formData.reading_time) <= 0) {
      missingFieldsSource.push(requiredFieldsLabels.reading_time);
    }

    // Çeviri istenmiyorsa (shouldTranslateParam false ise), hedef dildeki başlık ve içeriği de kontrol et
    const missingFieldsTarget = [];
    if (!shouldTranslateParam) {
      if (!formData.title[targetLanguage]) {
        missingFieldsTarget.push(requiredFieldsLabels.title);
      }
      if (!formData.content[targetLanguage]) {
        missingFieldsTarget.push(requiredFieldsLabels.content);
      }
    }

    if (missingFieldsSource.length > 0 || missingFieldsTarget.length > 0) {
      setValidationErrors({
        source: missingFieldsSource,
        target: missingFieldsTarget
      });
      setShowValidationAlert(true);
      return;
    }

    // Form verileri geçerliyse, state'i güncelle ve alert'i göster
    setShouldTranslate(shouldTranslateParam);
    setShowAlert(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsLoading(true);

      // Oturum kontrolü
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error('Oturum geçersiz veya süresi dolmuş');
        router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
        return;
      }

      // Tarihi kontrol et ve dönüştür
      let isoDate: string;
      try {
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(formData.created_at)) {
          throw new Error('Geçersiz tarih formatı. Tarih GG.AA.YYYY formatında olmalıdır.');
        }

        const [day, month, year] = formData.created_at.split('.').map(Number);
        
        if (isNaN(day) || isNaN(month) || isNaN(year) ||
            day < 1 || day > 31 ||
            month < 1 || month > 12 ||
            year < 1900 || year > 2100) {
          throw new Error('Geçersiz tarih değerleri');
        }

        const date = new Date(year, month - 1, day);
        
        if (date.getMonth() !== month - 1) {
          throw new Error('Geçersiz tarih (örn: 31.02.2024)');
        }

        isoDate = format(date, 'yyyy-MM-dd');
      } catch (error) {
        console.error('Tarih dönüştürme hatası:', error);
        toast.error(error instanceof Error ? error.message : 'Geçersiz tarih formatı');
        return;
      }

      // Eğer çeviri yapılacaksa, önce çevirileri yap
      let translatedTitle = formData.title[targetLanguage];
      let translatedContent = formData.content[targetLanguage];
      let translatedExcerpt = formData.excerpt[targetLanguage];
      let translatedTags: { [key: string]: string[] } | null = null;

      if (shouldTranslate) {
        try {
          // Başlık çevirisi
          translatedTitle = await translateText(formData.title[sourceLanguage], sourceLanguage, targetLanguage);
          
          // İçerik çevirisi
          translatedContent = await translateText(formData.content[sourceLanguage], sourceLanguage, targetLanguage);
          
          // Özet çevirisi (eğer varsa)
          if (formData.excerpt[sourceLanguage]) {
            translatedExcerpt = await translateText(formData.excerpt[sourceLanguage], sourceLanguage, targetLanguage);
          } else {
            // Özet yoksa içeriğin ilk 200 karakterini çevir
            translatedExcerpt = await translateText(
              formData.content[sourceLanguage].slice(0, 200) + '...',
              sourceLanguage,
              targetLanguage
            );
          }

          // Etiketleri çevir
          if (formData.tags[sourceLanguage].length > 0) {
            const translatedTagsArray = await Promise.all(
              formData.tags[sourceLanguage].map(tag =>
                translateText(tag, sourceLanguage, targetLanguage)
              )
            );
            translatedTags = {
              [sourceLanguage]: formData.tags[sourceLanguage],
              [targetLanguage]: translatedTagsArray
            };
          }
        } catch (error) {
          console.error('Çeviri hatası:', error);
          toast.error('Çeviri sırasında bir hata oluştu');
          return;
        }
      } else {
        // Çeviri yapılmayacaksa, mevcut etiketleri kullan
        translatedTags = formData.tags[sourceLanguage].length > 0 ? {
          [sourceLanguage]: formData.tags[sourceLanguage],
          [targetLanguage]: formData.tags[targetLanguage]
        } : null;
      }

      // Slug oluştur (sadece İngilizce başlıktan)
      let englishTitle = formData.title['en'] || 
        (sourceLanguage === 'en' 
          ? formData.title[sourceLanguage]
          : await translateText(formData.title[sourceLanguage], sourceLanguage, 'en'));

      // Türkçe karakterleri dönüştür ve slug oluştur
      const turkishToEnglish: { [key: string]: string } = {
        'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c',
        'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c'
      };

      const slug = englishTitle
        .split('')
        .map(char => turkishToEnglish[char] || char.toLowerCase())
        .join('')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Her iki dildeki verileri içeren post verisi
      const postData: PostData = {
        title: {
          [sourceLanguage]: formData.title[sourceLanguage],
          [targetLanguage]: translatedTitle
        },
        content: {
          [sourceLanguage]: formData.content[sourceLanguage],
          [targetLanguage]: translatedContent
        },
        excerpt: {
          [sourceLanguage]: formData.excerpt[sourceLanguage] || formData.content[sourceLanguage].slice(0, 200) + '...',
          [targetLanguage]: translatedExcerpt
        },
        category: formData.category,
        tags: translatedTags,
        image_url: formData.image_url,
        created_at: isoDate,
        author_id: session.user.id,
        reading_time: parseFloat(formData.reading_time),
        slug
      };

      // Debug için gönderilecek veriyi kontrol et
      console.log('Gönderilecek veri:', JSON.stringify(postData, null, 2));

      // Yazıyı kaydet
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.error || 'Bir hata oluştu');
      }

      toast.success('Yazı başarıyla kaydedildi');
      router.push('/admin/writings');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
      setShowAlert(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece görsel dosyaları yüklenebilir');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Görsel yüklenemedi');
      }

      const data = await response.json();

      setFormData(prev => ({
        ...prev,
        image_url: data.url
      }));

      toast.success('Görsel başarıyla yüklendi');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Görsel yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Etiketleri işle
  const handleTagsChange = (value: string) => {
    console.log('Girilen değer:', value); // Debug için
    setFormData({
      ...formData,
      tags: {
        ...formData.tags,
        [sourceLanguage]: [value] // Direkt olarak girilen değeri kullan
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Yeni Yazı Ekle</h1>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            İptal
          </Button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, shouldTranslate)} className="space-y-8">
          {/* Dil Seçimi */}
          <Card>
            <CardHeader>
              <CardTitle>Dil Seçimi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={sourceLanguage === 'tr' ? 'default' : 'outline'}
                  onClick={() => setSourceLanguage('tr')}
                >
                  Türkçe
                </Button>
                <Button
                  type="button"
                  variant={sourceLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => setSourceLanguage('en')}
                >
                  English
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ana Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle>Ana Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="created_at">Tarih *</Label>
                  <div className="relative">
                    <Input
                      id="created_at"
                      type="date"
                      value={formatDateForInput(formData.created_at)}
                      onChange={(e) => {
                        const formattedDate = formatDateForDisplay(e.target.value);
                        setFormData({ ...formData, created_at: formattedDate });
                      }}
                      className="[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent pointer-events-none"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="title">Başlık *</Label>
                    <span className="text-sm text-muted-foreground">
                      {formData.title[sourceLanguage].length}/40 karakter
                    </span>
                  </div>
                  <Input
                    id="title"
                    value={formData.title[sourceLanguage]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 40) {
                        setFormData({
                          ...formData,
                          title: { ...formData.title, [sourceLanguage]: value }
                        });
                      }
                    }}
                    placeholder={`Başlık (${sourceLanguage === 'tr' ? 'Türkçe' : 'English'})`}
                    maxLength={40}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="excerpt">Özet</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.excerpt[sourceLanguage].length}/200 karakter
                  </span>
                </div>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt[sourceLanguage]}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 200) {
                      setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, [sourceLanguage]: value }
                      });
                    }
                  }}
                  placeholder={`Özet (${sourceLanguage === 'tr' ? 'Türkçe' : 'English'})`}
                  className="h-24 w-full"
                  maxLength={200}
                />
                <p className="text-sm text-muted-foreground">
                  Boş bırakılırsa, yazının ilk 200 karakteri otomatik olarak özet olarak kullanılacaktır.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Yazı İçeriği */}
          <Card>
            <CardHeader>
              <CardTitle>Yazı İçeriği</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">İçerik *</Label>
                <Textarea
                  id="content"
                  value={formData.content[sourceLanguage]}
                  onChange={(e) => setFormData({
                    ...formData,
                    content: { ...formData.content, [sourceLanguage]: e.target.value }
                  })}
                  placeholder={`İçerik (${sourceLanguage === 'tr' ? 'Türkçe' : 'English'})`}
                  className="h-96"
                />
              </div>
            </CardContent>
          </Card>

          {/* Etiketler ve Okuma Süresi */}
          <Card>
            <CardHeader>
              <CardTitle>Etiketler ve Okuma Süresi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="tags">Etiketler</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.tags[sourceLanguage].length} etiket
                  </span>
                </div>
                <Input
                  id="tags"
                  type="text"
                  placeholder={`Etiketleri virgülle ayırarak girin (${sourceLanguage === 'tr' ? 'Türkçe' : 'English'})`}
                  value={formData.tags[sourceLanguage][0] || ''} // İlk etiketi göster
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log('Input değişti:', e.target.value); // Debug için
                    handleTagsChange(e.target.value);
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Etiketleri virgülle ayırarak girin. Örnek: etiket1,etiket2,etiket3
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reading_time">Okuma Süresi (dakika) *</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    id="reading_time"
                    type="number"
                    min="1"
                    max="999"
                    value={formData.reading_time}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      // Sadece pozitif tam sayıları kabul et
                      if (value === '' || /^[1-9]\d{0,2}$/.test(value)) {
                        setFormData({ ...formData, reading_time: value });
                      }
                    }}
                    placeholder="Örn: 5"
                    className="w-32"
                  />
                  <div className="text-sm text-muted-foreground">
                    AI Önerisi: {calculateReadingTime(formData.content[sourceLanguage])} dakika
                    <br />
                    <span className="text-xs">(Kelime sayısına göre hesaplanmıştır)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Görsel */}
          <Card>
            <CardHeader>
              <CardTitle>Görsel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg border">
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  ) : (
                    <img
                      src={formData.image_url}
                      alt="Yazı görseli"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Görsel Seç
                      </>
                    )}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG, GIF, WEBP
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Kaydet Butonları */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Çevriliyor...
                </>
              ) : (
                'Çevir ve Kaydet'
              )}
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
          </div>
        </form>

        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Onay</AlertDialogTitle>
              <AlertDialogDescription>
                {shouldTranslate
                  ? 'Yazı kaynak dildeki içerikten çevrilecek ve kaydedilecek. Devam etmek istiyor musunuz?'
                  : 'Yazıyı her iki dildeki mevcut içerikle kaydetmek istediğinizden emin misiniz?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSubmit}>
                {shouldTranslate ? 'Çevir ve Kaydet' : 'Kaydet'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eksik Alanlar</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4">
                  {validationErrors.source.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">{sourceLanguage === 'tr' ? 'Türkçe' : 'İngilizce'} dilinde eksik alanlar:</p>
                      <ul className="list-disc list-inside">
                        {validationErrors.source.map((field, index) => (
                          <li key={index}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validationErrors.target.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">{targetLanguage === 'tr' ? 'Türkçe' : 'İngilizce'} dilinde eksik alanlar:</p>
                      <ul className="list-disc list-inside">
                        {validationErrors.target.map((field, index) => (
                          <li key={index}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowValidationAlert(false)}>
                Tamam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
} 