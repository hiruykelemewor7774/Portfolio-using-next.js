INSERT INTO "projects" ("title", "description", "tech", "link", "cover", "featured", "sortOrder")
SELECT
  'University PC Registration',
  'A campus registration system for organizing student computer records, assigned devices, and computer lab access.',
  'University, PC Registration, Student Records, Computer Lab',
  NULL,
  '/project-university-pc-registration.svg',
  false,
  COALESCE((SELECT MAX("sortOrder") + 1 FROM "projects"), 0)
WHERE NOT EXISTS (
  SELECT 1 FROM "projects" WHERE lower(trim("title")) = 'university pc registration'
);
