import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Kullanıcı oturumunu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Oturum geçersiz veya süresi dolmuş' },
        { status: 401 }
      );
    }

    // Yazıyı getir
    const { data, error } = await supabase
      .from('writings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      
      let errorMessage = 'Yazı getirilemedi';
      
      if (error.code === 'PGRST116') {
        errorMessage = 'Yazı bulunamadı';
      } else if (error.code === '42501') {
        errorMessage = 'Yetkilendirme hatası: Bu işlem için yetkiniz yok';
      } else if (error.message) {
        errorMessage = `Yazı getirilemedi: ${error.message}`;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Kullanıcı oturumunu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Oturum geçersiz veya süresi dolmuş' },
        { status: 401 }
      );
    }

    // Yazıyı sil
    const { error } = await supabase
      .from('writings')
      .delete()
      .eq('id', params.id)
      .eq('author_id', session.user.id); // Sadece yazar silebilir

    if (error) {
      console.error('Database error:', error);
      
      let errorMessage = 'Yazı silinemedi';
      
      if (error.code === 'PGRST116') {
        errorMessage = 'Yazı bulunamadı';
      } else if (error.code === '42501') {
        errorMessage = 'Yetkilendirme hatası: Bu işlem için yetkiniz yok';
      } else if (error.message) {
        errorMessage = `Yazı silinemedi: ${error.message}`;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Yazıyı güncelle
    const { data, error } = await supabase
      .from('writings')
      .update({
        title: requestData.title,
        content: requestData.content,
        excerpt: requestData.excerpt,
        category: requestData.category,
        tags: requestData.tags,
        image_url: requestData.image_url,
        created_at: requestData.created_at,
        reading_time: requestData.reading_time,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('author_id', session.user.id) // Sadece yazar güncelleyebilir
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      let errorMessage = 'Yazı güncellenemedi';
      
      if (error.code === 'PGRST116') {
        errorMessage = 'Yazı bulunamadı';
      } else if (error.code === '42501') {
        errorMessage = 'Yetkilendirme hatası: Bu işlem için yetkiniz yok';
      } else if (error.message) {
        errorMessage = `Yazı güncellenemedi: ${error.message}`;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Yazı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 