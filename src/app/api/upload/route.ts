import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece görsel dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      );
    }

    // Dosyayı ArrayBuffer'a dönüştür
    const buffer = Buffer.from(await file.arrayBuffer());

    // WebP'ye dönüştür ve optimize et
    const webpBuffer = await sharp(buffer)
      .webp({ 
        quality: 80,
        effort: 6 // Daha iyi sıkıştırma için
      })
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    const fileName = `${uuidv4()}.webp`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(filePath, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: 'Dosya yüklenirken bir hata oluştu' },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      url: publicUrl,
      message: 'Görsel başarıyla WebP formatına dönüştürülüp yüklendi'
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 