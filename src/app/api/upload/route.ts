import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}.webp`;

    // WebP'ye dönüştür ve optimize et
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          }
        }
      }
    );

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Dosya yüklenirken bir hata oluştu' },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 