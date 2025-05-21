import { NextResponse } from 'next/server';
import { parse, format } from 'date-fns';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Kullanıcı oturumunu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Oturum geçersiz veya süresi dolmuş' },
        { status: 401 }
      );
    }

    const requestData = await request.json();
    console.log('Gelen veri:', JSON.stringify(requestData, null, 2));

    const {
      title,
      content,
      category,
      tags,
      image_url,
      created_at,
      should_translate,
      source_language,
      reading_time
    } = requestData;

    // Zorunlu alanları kontrol et
    if (!title || !content || !category || !created_at || !source_language || !reading_time) {
      console.error('Eksik alanlar:', { title, content, category, created_at, source_language, reading_time });
      return NextResponse.json(
        { error: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    // Okuma süresini kontrol et
    const readingTimeNum = parseFloat(reading_time);
    if (isNaN(readingTimeNum) || readingTimeNum <= 0 || readingTimeNum > 999) {
      console.error('Geçersiz okuma süresi:', reading_time);
      return NextResponse.json(
        { error: 'Geçersiz okuma süresi. 1 ile 999 dakika arasında olmalıdır.' },
        { status: 400 }
      );
    }

    // Tamsayıya çevir (smallint için)
    const readingTimeInt = Math.round(readingTimeNum);

    // Tarihi ISO formatına çevir (GG.AA.YYYY -> YYYY-MM-DD)
    let isoDate;
    try {
      const parsedDate = parse(created_at, 'dd.MM.yyyy', new Date());
      isoDate = format(parsedDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Tarih dönüştürme hatası:', error);
      return NextResponse.json(
        { error: 'Geçersiz tarih formatı' },
        { status: 400 }
      );
    }

    // Kategori kontrolü
    const validCategories = ['Şiirler', 'Anılar ve Öyküler', 'Denemeler', 'İnovasyon ve Girişimcilik', 'Tadımlar'];
    if (!validCategories.includes(category)) {
      console.error('Geçersiz kategori:', category);
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }

    // Slug oluştur
    const slug = {
      [source_language]: title[source_language]
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    };

    // Özet oluştur (eğer verilmemişse)
    const excerpt = {
      [source_language]: content[source_language].slice(0, 200) + '...'
    };

    // Gelen verileri kontrol et ve her iki dil için de veri olup olmadığını kontrol et
    const targetLanguage = source_language === 'tr' ? 'en' : 'tr';
    
    // Her iki dil için de veri var mı kontrol et
    const hasBothLanguages = title[targetLanguage] && content[targetLanguage];

    let postData: any = {
      title: { 
        [source_language]: title[source_language],
        ...(hasBothLanguages && { [targetLanguage]: title[targetLanguage] })
      },
      slug: { 
        [source_language]: slug[source_language],
        ...(hasBothLanguages && { 
          [targetLanguage]: title[targetLanguage]
            .toLowerCase()
            .replace(/[^a-z0-9ğüşıöç]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        })
      },
      content: { 
        [source_language]: content[source_language],
        ...(hasBothLanguages && { [targetLanguage]: content[targetLanguage] })
      },
      excerpt: { 
        [source_language]: excerpt[source_language],
        ...(hasBothLanguages && { [targetLanguage]: excerpt[targetLanguage] || content[targetLanguage].slice(0, 200) + '...' })
      },
      category,
      tags: tags ? { 
        [source_language]: tags,
        ...(hasBothLanguages && { [targetLanguage]: tags })
      } : null,
      image_url: image_url || '/ugursahan.webp',
      created_at: isoDate,
      author_id: session.user.id
    };

    // Çeviri isteniyorsa ve diğer dil için veri yoksa çeviri yap
    if (should_translate && !hasBothLanguages) {
      try {
        // Çevirileri sırayla yap
        const translatedTitle = await translateText(title[source_language], source_language, targetLanguage);
        const translatedContent = await translateText(content[source_language], source_language, targetLanguage);
        const translatedExcerpt = await translateText(excerpt[source_language], source_language, targetLanguage);

        // Çevirileri ekle
        postData.title[targetLanguage] = translatedTitle;
        postData.content[targetLanguage] = translatedContent;
        postData.excerpt[targetLanguage] = translatedExcerpt;
        postData.slug[targetLanguage] = translatedTitle
          .toLowerCase()
          .replace(/[^a-z0-9ğüşıöç]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        // Etiketleri çevir
        if (tags) {
          const translatedTags = [];
          for (const tag of tags) {
            try {
              const translatedTag = await translateText(tag, source_language, targetLanguage);
              translatedTags.push(translatedTag);
            } catch (error) {
              console.error(`Etiket çevirisi başarısız oldu: ${tag}`, error);
              translatedTags.push(tag); // Çeviri başarısız olursa orijinal etiketi kullan
            }
          }
          postData.tags[targetLanguage] = translatedTags;
        }
      } catch (error) {
        console.error('Translation error:', error);
        throw new Error(error instanceof Error ? error.message : 'Çeviri işlemi başarısız oldu');
      }
    }

    // Yazıyı kaydet
    try {
      const postToInsert = {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        category: postData.category,
        tags: postData.tags,
        image_url: postData.image_url,
        created_at: postData.created_at,
        is_published: true,
        reading_time: readingTimeInt,
        views: 0,
        author_id: session.user.id
      };

      console.log('Kaydedilecek veri:', JSON.stringify(postToInsert, null, 2));

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
          postgresError: error.postgresError,
          postgresCode: error.postgresCode,
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
      console.error('Database error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Veritabanı işlemi sırasında bir hata oluştu' },
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