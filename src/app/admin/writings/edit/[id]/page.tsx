'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
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

// Tip tanımlamaları
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
  slug: { [key: string]: string };
}

export default function EditWritingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const writingId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<'tr' | 'en'>('tr');
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [formData, setFormData] = useState({
    title: { tr: '', en: '' },
    content: { tr: '', en: '' },
    category: '',
    tags: [] as string[],
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

  // Yazı verilerini getir
  useEffect(() => {
    const fetchWriting = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          toast.error('Oturum geçersiz veya süresi dolmuş');
          router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
          return;
        }

        const response = await fetch(`/api/posts/${writingId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Yazı getirilemedi');
        }

        const data = await response.json();
        
        setFormData({
          title: data.title || { tr: '', en: '' },
          content: data.content || { tr: '', en: '' },
          category: data.category || '',
          tags: data.tags?.[sourceLanguage] || [],
          image_url: data.image_url || '/ugursahan.webp',
          created_at: format(new Date(data.created_at), 'dd.MM.yyyy'),
          excerpt: data.excerpt || { tr: '', en: '' },
          reading_time: data.reading_time?.toString() || ''
        });
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Yazı getirilirken bir hata oluştu');
        router.push('/admin/writings');
      }
    };

    if (isAuthenticated && writingId) {
      fetchWriting();
    }
  }, [writingId, isAuthenticated, router, pathname]);

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
      const date = parse(dateStr, 'dd.MM.yyyy', new Date());
      return format(date, 'yyyy-MM-dd');
    } catch {
      return dateStr;
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    try {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      return format(date, 'dd.MM.yyyy');
    } catch {
      return dateStr;
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

    if (missingFieldsSource.length > 0) {
      toast.error(`Lütfen ${sourceLanguage === 'tr' ? 'Türkçe' : 'İngilizce'} ${missingFieldsSource.join(', ')} alanlarını doldurun`);
      return;
    }

    // Çeviri istenmiyorsa (shouldTranslateParam false ise), hedef dildeki başlık ve içeriği de kontrol et
    if (!shouldTranslateParam) {
      const targetLanguage = sourceLanguage === 'tr' ? 'en' : 'tr';
      const missingFieldsTarget = [];
      if (!formData.title[targetLanguage]) {
        missingFieldsTarget.push(requiredFieldsLabels.title);
      }
      if (!formData.content[targetLanguage]) {
        missingFieldsTarget.push(requiredFieldsLabels.content);
      }

      if (missingFieldsTarget.length > 0) {
        toast.error(`Lütfen ${targetLanguage === 'tr' ? 'Türkçe' : 'İngilizce'} dilinde ${missingFieldsTarget.join(', ')} alanlarını doldurun`);
        return;
      }
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

      // Tarihi ISO formatına çevir
      const formattedDate = format(parse(formData.created_at, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd');

      const targetLanguage = sourceLanguage === 'tr' ? 'en' : 'tr';
      const postData: PostData = {
        title: { [sourceLanguage]: formData.title[sourceLanguage] },
        content: { [sourceLanguage]: formData.content[sourceLanguage] },
        excerpt: { [sourceLanguage]: formData.excerpt[sourceLanguage] || formData.content[sourceLanguage].slice(0, 200) + '...' },
        category: formData.category,
        tags: formData.tags.length > 0 ? { [sourceLanguage]: formData.tags } : null,
        image_url: formData.image_url,
        created_at: formattedDate,
        author_id: session.user.id,
        reading_time: parseFloat(formData.reading_time)
      };

      // Slug oluştur (sadece İngilizce başlıktan)
      let englishTitle = sourceLanguage === 'en' 
        ? formData.title[sourceLanguage]
        : await translateText(formData.title[sourceLanguage], sourceLanguage, 'en');

      // Türkçe karakterleri dönüştür ve büyük harfleri küçült
      const turkishToEnglish: { [key: string]: string } = {
        'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c',
        'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c'
      };

      postData.slug = englishTitle
        .split('')
        .map(char => turkishToEnglish[char] || char.toLowerCase())
        .join('')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Çeviri isteniyorsa ve diğer dil için veri yoksa çeviri yap
      if (shouldTranslate && !hasBothLanguages) {
        try {
          // Çevirileri sırayla yap
          const translatedTitle = await translateText(formData.title[sourceLanguage], sourceLanguage, targetLanguage);
          const translatedContent = await translateText(formData.content[sourceLanguage], sourceLanguage, targetLanguage);
          const translatedExcerpt = await translateText(formData.excerpt[sourceLanguage], sourceLanguage, targetLanguage);

          // Çevirileri ekle
          postData.title[targetLanguage] = translatedTitle;
          postData.content[targetLanguage] = translatedContent;
          postData.excerpt[targetLanguage] = translatedExcerpt;

          // Etiketleri çevir
          if (formData.tags.length > 0) {
            const translatedTags = [];
            for (const tag of formData.tags) {
              try {
                const translatedTag = await translateText(tag, sourceLanguage, targetLanguage);
                translatedTags.push(translatedTag);
              } catch (error) {
                console.error(`Etiket çevirisi başarısız oldu: ${tag}`, error);
                translatedTags.push(tag); // Çeviri başarısız olursa orijinal etiketi kullan
              }
            }
            if (postData.tags) {
              postData.tags[targetLanguage] = translatedTags;
            }
          }
        } catch (error) {
          console.error('Translation error:', error);
          throw new Error(error instanceof Error ? error.message : 'Çeviri işlemi başarısız oldu');
        }
      } else {
        // Çeviri istenmiyorsa, diğer dildeki verileri ekle
        postData.title[targetLanguage] = formData.title[targetLanguage];
        postData.content[targetLanguage] = formData.content[targetLanguage];
        postData.excerpt[targetLanguage] = formData.excerpt[targetLanguage] || formData.content[targetLanguage].slice(0, 200) + '...';
        if (formData.tags.length > 0 && postData.tags) {
          postData.tags[targetLanguage] = formData.tags;
        }
      }

      // Yazıyı güncelle
      const response = await fetch(`/api/posts/${writingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...postData,
          should_translate: shouldTranslate,
          source_language: sourceLanguage
        })
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

      toast.success('Yazı başarıyla güncellendi');
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

  // Yazıyı sil
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error('Oturum geçersiz veya süresi dolmuş');
        router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
        return;
      }

      const response = await fetch(`/api/posts/${writingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Yazı silinemedi');
      }

      toast.success('Yazı başarıyla silindi');
      router.push('/admin/writings');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Yazı silinirken bir hata oluştu');
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Yazıyı Düzenle</h1>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading || isDeleting}
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
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-2">
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

                <div className="col-span-3 space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
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

                <div className="col-span-6 space-y-2">
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
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tags">Etiketler</Label>
                <Input
                  id="tags"
                  placeholder="Etiketleri virgülle ayırarak girin"
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                />
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
                    onChange={(e) => {
                      const value = e.target.value;
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
              variant="destructive"
              onClick={() => setShowDeleteAlert(true)}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                'Sil'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading || isDeleting}
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
              disabled={isLoading || isDeleting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                'Güncelle'
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

        {/* Silme Onay Dialog'u */}
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Yazıyı Sil</AlertDialogTitle>
              <AlertDialogDescription>
                Bu yazıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
} 