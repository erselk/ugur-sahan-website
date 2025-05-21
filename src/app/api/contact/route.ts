import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Form verilerini doğrula
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // E-posta formatını doğrula
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi' },
        { status: 400 }
      );
    }

    // Veritabanına kaydet
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Mesaj kaydedilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Mesaj başarıyla gönderildi', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 