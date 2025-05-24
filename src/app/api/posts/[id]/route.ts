import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: Record<string, unknown>) {
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

    // Yazıyı getir
    const { data, error } = await supabase
      .from('writings')
      .select('*')
      .eq('id', id)
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
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: Record<string, unknown>) {
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

    // Yazıyı sil
    const { error } = await supabase
      .from('writings')
      .delete()
      .eq('id', id)
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
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: Record<string, unknown>) {
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
      .eq('id', id)
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
    return handleError(error);
  }
}

async function handleError(error: unknown): Promise<NextResponse<{ error: string }>> {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'Bilinmeyen bir hata oluştu' }, { status: 500 });
} 