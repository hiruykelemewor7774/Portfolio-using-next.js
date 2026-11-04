DELETE FROM "projects" AS duplicate
WHERE lower(trim(duplicate."title")) = 'malaria identification app'
  AND EXISTS (
    SELECT 1
    FROM "projects" AS canonical
    WHERE lower(trim(canonical."title")) = 'malaria identification'
  );
