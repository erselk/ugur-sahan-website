export async function translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguage,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Çeviri başarısız oldu');
  }

  const data = await response.json();
  return data.translatedText;
} 