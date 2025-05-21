import { NextResponse } from 'next/server';
import { parse, format } from 'date-fns';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { PostgrestError } from '@supabase/supabase-js';

const translatorEndpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&region=${process.env.MS_TRANSLATOR_REGION}`;

async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  const baseEndpoint = "https://api.cognitive.microsofttranslator.com/translate";
  const url = new URL(baseEndpoint);
  url.searchParams.append('api-version', '3.0');
  url.searchParams.append('from', sourceLanguage);
  url.searchParams.append('to', targetLanguage);
  url.searchParams.append('region', process.env.MS_TRANSLATOR_REGION!);

  console.log('Translation request URL:', url.toString());

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.MS_TRANSLATOR_API_KEY!,
      'Ocp-Apim-Subscription-Region': process.env.MS_TRANSLATOR_REGION!
    },
    body: JSON.stringify([{
      text
    }])
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    console.error('Translation API error:', responseText);
    throw new Error(`Çeviri başarısız oldu: ${responseText}`);
  }

  let result;
  try {
    result = JSON.parse(responseText);
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error('Çeviri yanıtı işlenemedi');
  }

  const translatedText = result[0]?.translations[0]?.text;

  if (!translatedText) {
    console.error('Translation result:', result);
    throw new Error('Çeviri sonucu bulunamadı');
  }

  return translatedText;
}

async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

async function setCookie(name: string, value: string, options: any) {
  const cookieStore = await cookies();
  cookieStore.set({ name, value, ...options });
}

async function deleteCookie(name: string, options: any) {
  const cookieStore = await cookies();
  cookieStore.set({ name, value: '', ...options });
}

// PostgrestError tipini genişlet
interface ExtendedPostgrestError extends PostgrestError {
  postgresError?: string;
  postgresCode?: string;
}

interface PostFormData {
  title: { [key: string]: string };
  content: { [key: string]: string };
  excerpt?: { [key: string]: string };
  category: string;
  tags?: string[] | { [key: string]: string[] };  // Etiketler string[] veya { tr: string[], en: string[] } olabilir
  image_url: string;
  created_at: string;
  reading_time: string | number;
  should_translate?: boolean;
}

interface PostToInsert {
  title: { [key: string]: string };
  slug: string;
  content: { [key: string]: string };
  excerpt: { [key: string]: string };
  category: string;
  tags: { [key: string]: string[] } | null;
  image_url: string;
  created_at: string;
  is_published: boolean;
  reading_time: number;
  views: number;
  author_id: string;
}

async function handleTranslation(
  postData: Partial<PostToInsert>,
  sourceLanguage: 'tr' | 'en',
  targetLanguage: 'tr' | 'en',
  shouldTranslate: boolean
): Promise<Partial<PostToInsert>> {
  if (!shouldTranslate || !targetLanguage || postData.title?.[targetLanguage]) {
    return postData;
  }

  try {
    // Debug için çeviri öncesi veriyi kontrol et
    console.log('Çeviri öncesi postData:', JSON.stringify(postData, null, 2));

    // Çevirileri sırayla yap
    const translatedTitle = await translateText(postData.title![sourceLanguage], sourceLanguage, targetLanguage);
    const translatedContent = await translateText(postData.content![sourceLanguage], sourceLanguage, targetLanguage);
    const translatedExcerpt = await translateText(
      postData.excerpt?.[sourceLanguage] || postData.content![sourceLanguage].slice(0, 200) + '...',
      sourceLanguage, targetLanguage
    );

    // Çevirileri ekle
    if (postData.title && postData.content && postData.excerpt) {
      postData.title[targetLanguage] = translatedTitle;
      postData.content[targetLanguage] = translatedContent;
      postData.excerpt[targetLanguage] = translatedExcerpt;

      // Etiketleri çevir
      if (postData.tags && postData.tags[sourceLanguage]) {
        console.log('Etiketler çevriliyor:', postData.tags[sourceLanguage]);
        
        try {
          const translatedTags = await Promise.all(
            postData.tags[sourceLanguage].map(async (tag) => {
              const translated = await translateText(tag, sourceLanguage, targetLanguage);
              console.log(`Etiket çevirisi: ${tag} -> ${translated}`);
              return translated;
            })
          );
          
          // Etiketleri hedef dile ekle
          postData.tags = {
            ...postData.tags,
            [targetLanguage]: translatedTags
          };
          
          console.log('Çevrilmiş etiketler:', translatedTags);
        } catch (error) {
          console.error('Etiket çevirisi hatası:', error);
          throw new Error('Etiketler çevrilirken bir hata oluştu');
        }
      }
    }

    // Debug için çeviri sonrası veriyi kontrol et
    console.log('Çeviri sonrası postData:', JSON.stringify(postData, null, 2));

    return postData;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Çeviri işlemi başarısız oldu');
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return getCookie(name);
          },
          set(name: string, value: string, options: any) {
            return setCookie(name, value, options);
          },
          remove(name: string, options: any) {
            return deleteCookie(name, options);
          },
        },
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Oturum geçersiz veya süresi dolmuş' }, { status: 401 });
    }

    const formData = await request.json() as PostFormData;
    const { title, content, excerpt: userExcerpt, category, tags, image_url, reading_time, should_translate } = formData;

    // Debug için gelen veriyi kontrol et
    console.log('API\'ye gelen veri:', {
      should_translate,
      sourceLanguage: Object.keys(title)[0],
      tags,
      formData: JSON.stringify(formData, null, 2)
    });

    // Kaynak dil ve hedef dili belirle
    const sourceLanguage = Object.keys(title)[0] as 'tr' | 'en';
    const targetLanguage = sourceLanguage === 'tr' ? 'en' : 'tr';

    // Etiketleri işle
    let processedTags: { [key: string]: string[] } | null = null;
    if (tags) {
      // Eğer etiketler zaten çevrilmişse (hem tr hem en varsa)
      if (typeof tags === 'object' && !Array.isArray(tags) && 'tr' in tags && 'en' in tags) {
        const typedTags = tags as { tr: string[], en: string[] };
        processedTags = {
          tr: Array.isArray(typedTags.tr) ? typedTags.tr : [],
          en: Array.isArray(typedTags.en) ? typedTags.en : []
        };
      }
      // Eğer sadece kaynak dilde etiketler varsa
      else if (Array.isArray(tags)) {
        processedTags = {
          [sourceLanguage]: tags
        };
      }
      // Eğer etiketler obje ise ve sadece kaynak dilde varsa
      else if (typeof tags === 'object' && !Array.isArray(tags) && sourceLanguage in tags) {
        const typedTags = tags as { [key: string]: string[] };
        processedTags = {
          [sourceLanguage]: Array.isArray(typedTags[sourceLanguage]) ? typedTags[sourceLanguage] : []
        };
      }
    }

    // Zorunlu alanları kontrol et
    if (!title?.[sourceLanguage] || !content?.[sourceLanguage] || !category || !reading_time) {
      console.error('Eksik alanlar:', { title, content, category, reading_time });
      return NextResponse.json(
        { error: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    // Okuma süresini kontrol et
    const readingTimeNum = typeof reading_time === 'string' ? parseFloat(reading_time) : reading_time;
    if (isNaN(readingTimeNum) || readingTimeNum <= 0 || readingTimeNum > 999) {
      console.error('Geçersiz okuma süresi:', reading_time);
      return NextResponse.json(
        { error: 'Geçersiz okuma süresi. 1 ile 999 dakika arasında olmalıdır.' },
        { status: 400 }
      );
    }

    // Tamsayıya çevir (smallint için)
    const readingTimeInt = Math.round(readingTimeNum);

    // Tarihi kontrol et ve dönüştür
    let isoDate: string;
    try {
      // Eğer tarih zaten ISO formatındaysa (yyyy-MM-dd veya yyyy-MM-dd HH:mm:ss.SSSSSS+00)
      if (/^\d{4}-\d{2}-\d{2}/.test(formData.created_at)) {
        const date = new Date(formData.created_at);
        if (isNaN(date.getTime())) {
          throw new Error('Geçersiz tarih değeri');
        }
        isoDate = format(date, 'yyyy-MM-dd');
      } 
      // Eğer tarih GG.AA.YYYY formatındaysa
      else if (/^\d{2}\.\d{2}\.\d{4}$/.test(formData.created_at)) {
        // Tarihi parçalara ayır
        const [day, month, year] = formData.created_at.split('.').map(Number);
        
        // Tarih değerlerini kontrol et
        if (isNaN(day) || isNaN(month) || isNaN(year) ||
            day < 1 || day > 31 ||
            month < 1 || month > 12 ||
            year < 1900 || year > 2100) {
          throw new Error('Geçersiz tarih değerleri');
        }

        // Tarihi oluştur
        const date = new Date(year, month - 1, day);
        
        // Tarihin geçerli olup olmadığını kontrol et
        if (date.getMonth() !== month - 1) {
          throw new Error('Geçersiz tarih (örn: 31.02.2024)');
        }

        isoDate = format(date, 'yyyy-MM-dd');
      } else {
        throw new Error('Geçersiz tarih formatı. Tarih GG.AA.YYYY veya YYYY-MM-DD formatında olmalıdır.');
      }

      console.log('API\'de işlenen tarih:', { 
        original: formData.created_at, 
        iso: isoDate,
        parsed: new Date(isoDate).toISOString()
      });
    } catch (error) {
      console.error('Tarih dönüştürme hatası:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Geçersiz tarih formatı' },
        { status: 400 }
      );
    }

    // Kategori kontrolü
    const validCategories = ['Şiirler', 'Anılar ve Öyküler', 'Denemeler', 'İnovasyon ve Girişimcilik', 'Tadımlar'] as const;
    if (!validCategories.includes(category as typeof validCategories[number])) {
      console.error('Geçersiz kategori:', category);
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    // Slug oluştur (sadece İngilizce başlıktan)
    let englishTitle = sourceLanguage === 'en' 
      ? title[sourceLanguage]
      : await translateText(title[sourceLanguage], sourceLanguage, 'en');

    // Türkçe karakterleri dönüştür ve slug oluştur
    const turkishToEnglish: { [key: string]: string } = {
      'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c',
      'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c'
    };

    const slug = englishTitle
      .split('')
      .map((char: string) => turkishToEnglish[char] || char.toLowerCase())
      .join('')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    let postData: Partial<PostToInsert> = {
      title: { 
        [sourceLanguage]: title[sourceLanguage],
        ...(targetLanguage && title[targetLanguage] && { [targetLanguage]: title[targetLanguage] })
      },
      slug,
      content: { 
        [sourceLanguage]: content[sourceLanguage],
        ...(targetLanguage && content[targetLanguage] && { [targetLanguage]: content[targetLanguage] })
      },
      excerpt: { 
        [sourceLanguage]: userExcerpt?.[sourceLanguage] || content[sourceLanguage].slice(0, 200) + '...',
        ...(targetLanguage && content[targetLanguage] && { 
          [targetLanguage]: userExcerpt?.[targetLanguage] || content[targetLanguage].slice(0, 200) + '...'
        })
      },
      category,
      tags: processedTags,
      image_url: image_url || '/ugursahan.webp',
      created_at: isoDate,
      author_id: session.user.id
    };

    // Debug için postData'yı kontrol et
    console.log('Çeviri öncesi postData:', {
      should_translate,
      sourceLanguage,
      targetLanguage,
      tags: postData.tags,
      data: JSON.stringify(postData, null, 2)
    });

    // Çeviri işlemini yap
    // Eğer should_translate undefined ise ama hedef dilde içerik yoksa çeviri yap
    const needsTranslation = should_translate === true || 
      (!postData.title?.[targetLanguage] && !postData.content?.[targetLanguage]);

    if (needsTranslation) {
      console.log('Çeviri başlıyor...');
      postData = await handleTranslation(postData, sourceLanguage, targetLanguage, true);
      console.log('Çeviri tamamlandı:', {
        tags: postData.tags,
        data: JSON.stringify(postData, null, 2)
      });
    } else {
      console.log('Çeviri yapılmayacak:', { 
        should_translate,
        hasTargetContent: {
          title: !!postData.title?.[targetLanguage],
          content: !!postData.content?.[targetLanguage],
          tags: !!postData.tags?.[targetLanguage]
        }
      });
    }

    // Yazıyı kaydet
    try {
      const postToInsert: PostToInsert = {
        title: postData.title!,
        slug,
        content: postData.content!,
        excerpt: postData.excerpt!,
        category: postData.category!,
        tags: postData.tags || null,
        image_url: postData.image_url!,
        created_at: postData.created_at!,
        is_published: true,
        reading_time: readingTimeInt,
        views: 0,
        author_id: postData.author_id!
      };

      // Debug için son veriyi kontrol et
      console.log('Kaydedilecek son veri:', {
        tags: postToInsert.tags,
        data: JSON.stringify(postToInsert, null, 2)
      });

      // Önce tablo yapısını kontrol et
      const { data: tableInfo, error: tableError } = await supabase
        .from('writings')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error('Tablo kontrol hatası:', tableError);
        throw new Error('Veritabanı tablosu kontrol edilemedi: ' + tableError.message);
      }

      // Veriyi kaydet
      const { data, error } = await supabase
        .from('writings')
        .insert([postToInsert])
        .select()
        .single();

      if (error) {
        // Supabase hata detaylarını daha detaylı logla
        console.error('Supabase error details:', {
          error,
          errorObject: JSON.stringify(error, null, 2),
          errorMessage: error.message,
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint,
          tableInfo
        });

        // Hata mesajını oluştur
        let errorMessage = 'Yazı kaydedilemedi';
        
        if (error.code === '23505') {
          errorMessage = 'Bu başlıkta bir yazı zaten mevcut';
        } else if (error.code === '23503') {
          errorMessage = 'Geçersiz kategori veya yazar';
        } else if (error.code === '42P01') {
          errorMessage = 'Veritabanı tablosu bulunamadı';
        } else if (error.code === '42501') {
          errorMessage = 'Yetkilendirme hatası: Bu işlem için yetkiniz yok';
        } else if (error.message) {
          errorMessage = `Yazı kaydedilemedi: ${error.message}`;
        }

        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error('Yazı kaydedildi fakat veri dönmedi');
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error('Error creating post:', error);
      const pgError = error as PostgrestError;
      return NextResponse.json(
        { 
          error: 'Yazı oluşturulurken bir hata oluştu',
          details: pgError.message,
          code: pgError.code,
          hint: pgError.hint,
          detailsText: pgError.details
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 