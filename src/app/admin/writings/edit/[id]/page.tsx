'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { CalendarIcon, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { translateText } from '@/lib/translate';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';

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
  sourceLanguage: 'tr' | 'en';
  targetLanguage: 'tr' | 'en';
  should_translate: boolean;
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
  const targetLanguage = sourceLanguage === 'tr' ? 'en' : 'tr';
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ source: string[], target: string[] }>({ source: [], target: [] });
  const [formData, setFormData] = useState({
    title: { tr: '', en: '' },
    content: { tr: '', en: '' },
    category: '',
    tags: { tr: [] as string[], en: [] as string[] },
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_OUT') {
        router.push('/admin/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // Dil değişimini yöneten fonksiyon
  const handleLanguageChange = (newSourceLanguage: 'tr' | 'en') => {
    setSourceLanguage(newSourceLanguage);
  };

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
        console.log('API\'den gelen veri:', data);
        
        // Etiketleri güvenli bir şekilde işle
        const tags = {
          tr: Array.isArray(data.tags?.tr) ? data.tags.tr : [],
          en: Array.isArray(data.tags?.en) ? data.tags.en : []
        };

        // Başlık, içerik ve özet için varsayılan değerleri ayarla
        const title = {
          tr: data.title?.tr || '',
          en: data.title?.en || ''
        };

        const content = {
          tr: data.content?.tr || '',
          en: data.content?.en || ''
        };

        const excerpt = {
          tr: data.excerpt?.tr || '',
          en: data.excerpt?.en || ''
        };

        // ISO 8601 formatındaki tarihi doğrudan kullan
        const formattedDate = formatDateForDisplay(data.created_at);
        console.log('Formatlanmış tarih:', formattedDate);
        
        setFormData({
          title,
          content,
          category: data.category || '',
          tags,
          image_url: data.image_url || '/ugursahan.webp',
          created_at: formattedDate,
          excerpt,
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
  }, [writingId, isAuthenticated, router]);

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
      
      // Boş veya geçersiz tarih kontrolü
      if (!dateStr) {
        return format(new Date(), 'yyyy-MM-dd');
      }

      // GG.AA.YYYY formatındaki tarihi parse et
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return format(date, 'yyyy-MM-dd');
        }
      }

      // ISO formatındaki tarihi parse et
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'yyyy-MM-dd');
      }

      // Hiçbir format çalışmazsa bugünün tarihini döndür
      console.warn('Geçersiz tarih formatı, bugünün tarihi kullanılıyor:', dateStr);
      return format(new Date(), 'yyyy-MM-dd');
    } catch (error) {
      console.error('formatDateForInput hatası:', error);
      return format(new Date(), 'yyyy-MM-dd');
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    try {
      console.log('formatDateForDisplay giriş:', dateStr);
      
      // Boş veya geçersiz tarih kontrolü
      if (!dateStr) {
        return format(new Date(), 'dd.MM.yyyy');
      }

      // GG.AA.YYYY formatındaysa direkt döndür
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        return dateStr;
      }

      // ISO formatındaki tarihi parse et
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'dd.MM.yyyy');
      }

      // Hiçbir format çalışmazsa bugünün tarihini döndür
      console.warn('Geçersiz tarih formatı, bugünün tarihi kullanılıyor:', dateStr);
      return format(new Date(), 'dd.MM.yyyy');
    } catch (error) {
      console.error('formatDateForDisplay hatası:', error);
      return format(new Date(), 'dd.MM.yyyy');
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

      const targetLanguage = sourceLanguage === 'tr' ? 'en' : 'tr';

      // Eğer çeviri yapılacaksa, önce çevirileri yap
      let translatedTitle = formData.title[targetLanguage];
      let translatedContent = formData.content[targetLanguage];
      let translatedExcerpt = formData.excerpt[targetLanguage];
      let translatedTags = formData.tags[targetLanguage];

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
            translatedTags = translatedTagsArray;
          }
        } catch (error) {
          console.error('Çeviri hatası:', error);
          toast.error('Çeviri sırasında bir hata oluştu');
          return;
        }
      }

      // Slug oluştur
      const slug = {
        [sourceLanguage]: formData.title[sourceLanguage]
          .toLowerCase()
          .replace(/[^a-z0-9ğüşıöç]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
        [targetLanguage]: translatedTitle
          .toLowerCase()
          .replace(/[^a-z0-9ğüşıöç]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      };

      // Her iki dildeki verileri içeren post verisi
      const postData = {
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
        tags: {
          [sourceLanguage]: formData.tags[sourceLanguage],
          [targetLanguage]: translatedTags
        },
        image_url: formData.image_url,
        created_at: isoDate,
        author_id: session.user.id,
        reading_time: parseFloat(formData.reading_time),
        slug
      };

      console.log('Gönderilecek veri:', postData);

      // Yazıyı güncelle
      const response = await fetch(`/api/posts/${writingId}`, {
        method: 'PUT',
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

  const turkishToEnglish: Record<string, string> = {
    'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c',
    'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c'
  };

  const hasBothLanguages = Boolean(formData.title[targetLanguage] && formData.content[targetLanguage]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto py-8">
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
                    onClick={() => handleLanguageChange('tr')}
                  >
                    Türkçe
                  </Button>
                  <Button
                    type="button"
                    variant={sourceLanguage === 'en' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('en')}
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
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: string) => (
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
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tags">Etiketler ({sourceLanguage === 'tr' ? 'Türkçe' : 'English'})</Label>
                  <Input
                    id="tags"
                    value={formData.tags[sourceLanguage]?.join(', ') || ''}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      setFormData({
                        ...formData,
                        tags: {
                          ...formData.tags,
                          [sourceLanguage]: tags
                        }
                      });
                    }}
                    placeholder="Etiketleri virgülle ayırarak girin"
                  />
                  {formData.tags[targetLanguage]?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {targetLanguage === 'tr' ? 'Türkçe' : 'English'} etiketler: {formData.tags[targetLanguage].join(', ')}
                      </p>
                    </div>
                  )}
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
        </div>
      </motion.div>
    </div>
  );
} 