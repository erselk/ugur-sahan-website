-- Önce Türkçe karakterleri değiştir ve küçük harfe çevir
UPDATE public.writings
SET slug = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      CASE 
                        WHEN title->>'en' IS NOT NULL THEN title->>'en'
                        ELSE title->>'tr'
                      END,
                      'Ğ', 'g'
                    ),
                    'Ü', 'u'
                  ),
                  'Ş', 's'
                ),
                'İ', 'i'
              ),
              'Ö', 'o'
            ),
            'Ç', 'c'
          ),
          'ğ', 'g'
        ),
        'ü', 'u'
      ),
      'ş', 's'
    ),
    'ı', 'i'
  )
);

-- Özel karakterleri tire ile değiştir
UPDATE public.writings
SET slug = REGEXP_REPLACE(slug, '[^a-z0-9]', '-', 'g');

-- Ardışık tireleri tek tireye indir
UPDATE public.writings
SET slug = REGEXP_REPLACE(slug, '-+', '-', 'g');

-- Baştaki ve sondaki tireleri kaldır
UPDATE public.writings
SET slug = TRIM(BOTH '-' FROM slug);

-- Slug'ların benzersiz olduğundan emin ol
DO $$
DECLARE
  duplicate_slugs RECORD;
BEGIN
  FOR duplicate_slugs IN
    SELECT slug, COUNT(*) as count
    FROM public.writings
    GROUP BY slug
    HAVING COUNT(*) > 1
  LOOP
    -- Tekrarlanan slug'ları güncelle
    UPDATE public.writings
    SET slug = slug || '-' || id::text
    WHERE slug = duplicate_slugs.slug
    AND id NOT IN (
      SELECT MIN(id)
      FROM public.writings
      WHERE slug = duplicate_slugs.slug
      GROUP BY slug
    );
  END LOOP;
END $$; 