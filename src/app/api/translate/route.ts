import { NextResponse } from "next/server";

const baseEndpoint = "https://api.cognitive.microsofttranslator.com/translate";

export async function POST(request: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Metin, kaynak dil ve hedef dil gereklidir' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Çeviri sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 