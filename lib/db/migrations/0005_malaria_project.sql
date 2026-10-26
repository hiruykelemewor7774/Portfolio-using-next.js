UPDATE "projects"
SET "cover" = '/project-malaria-identification.svg'
WHERE "title" = 'Malaria Identification'
  AND ("cover" IS NULL OR "cover" = '');
--> statement-breakpoint
INSERT INTO "projects" ("title", "description", "tech", "cover", "featured", "sortOrder")
SELECT
  'Malaria Identification',
  'A malaria identification project focused on recognizing parasites in blood-smear imagery.',
  'Computer Vision, Image Analysis, Healthcare',
  '/project-malaria-identification.svg',
  false,
  4
WHERE NOT EXISTS (
  SELECT 1 FROM "projects" WHERE "title" = 'Malaria Identification'
);
