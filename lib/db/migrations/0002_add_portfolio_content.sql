CREATE TABLE "journalEntries" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"url" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolioProfile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"displayName" text DEFAULT 'Alemu Kelemework' NOT NULL,
	"role" text DEFAULT 'Full-Stack Developer' NOT NULL,
	"heroIntro" text NOT NULL,
	"heroDetail" text NOT NULL,
	"aboutPrimary" text NOT NULL,
	"aboutSecondary" text NOT NULL,
	"yearsLearning" text DEFAULT '04+' NOT NULL,
	"projectsCompleted" text DEFAULT '10+' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT 'Code2' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siteSettings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"siteTitle" text DEFAULT 'Alemu Kelemework — Developer Portfolio' NOT NULL,
	"contactEmail" text DEFAULT 'alemukelemework363@gmail.com' NOT NULL,
	"resumeUrl" text DEFAULT '/alemu-kelemework-cv.pdf' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "socialAccounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "portfolioProfile" ("id", "displayName", "role", "heroIntro", "heroDetail", "aboutPrimary", "aboutSecondary", "yearsLearning", "projectsCompleted")
VALUES (1, 'Alemu Kelemework', 'Full-Stack Developer', 'I build modern web applications and solve real-world problems.', 'I''m a fourth-year Computer Science student at Mizan-Tepi University and a Software Engineering Intern at Ethio Telecom.', 'I''m a fourth-year Computer Science student at Mizan-Tepi University and a Software Engineering Intern at Ethio Telecom in Dembel, Addis Ababa.', 'My work sits at the intersection of clean engineering and human-centered design. I turn complex requirements into simple, scalable experiences that teams can actually use.', '04+', '10+')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "siteSettings" ("id", "siteTitle", "contactEmail", "resumeUrl")
VALUES (1, 'Alemu Kelemework — Developer Portfolio', 'alemukelemework363@gmail.com', '/alemu-kelemework-cv.pdf')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "projects" ("title", "description", "tech", "link", "featured", "sortOrder")
SELECT defaults."title", defaults."description", defaults."tech", NULL, false, defaults."sortOrder"
FROM (VALUES
	('Task Management System', 'A calm, structured workspace for teams to plan, assign, and ship work with clarity.', 'Next.js, NestJS, Swagger', 0),
	('Restaurant Management', 'A streamlined operations platform connecting menus, orders, staff, and daily decisions.', 'Next.js, TypeScript, PostgreSQL', 1),
	('Construction Management', 'A connected platform for managing construction projects, teams, materials, and site operations.', 'Next.js, NestJS, Prisma, PostgreSQL', 2),
	('Qene Bet Website', 'A modern mobile-first experience designed to simplify daily workflows and improve accessibility.', 'React, TypeScript, API Integration', 3)
) AS defaults("title", "description", "tech", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "projects");
--> statement-breakpoint
INSERT INTO "skills" ("name", "category", "sortOrder")
SELECT defaults."name", 'general', defaults."sortOrder"
FROM (VALUES
	('HTML', 0), ('CSS', 1), ('JavaScript', 2), ('TypeScript', 3), ('React', 4),
	('Next.js', 5), ('NestJS', 6), ('Swagger', 7), ('Better Auth', 8), ('Docker', 9),
	('Prisma', 10), ('PostgreSQL', 11), ('Git', 12), ('Tailwind CSS', 13)
) AS defaults("name", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "skills");
--> statement-breakpoint
INSERT INTO "experiences" ("role", "organization", "period", "description", "sortOrder")
SELECT defaults."role", defaults."organization", defaults."period", defaults."description", defaults."sortOrder"
FROM (VALUES
	('Software Engineering Intern', 'Ethio Telecom', '2024 — NOW', 'Building internal tools and learning how reliable software supports a large, connected organization.', 0),
	('Computer Science Student', 'Mizan-Tepi University', '2022 — NOW', 'Studying the foundations behind the interfaces, systems, and products I build every day.', 1)
) AS defaults("role", "organization", "period", "description", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "experiences");
--> statement-breakpoint
INSERT INTO "education" ("degree", "institution", "period", "details", "status", "sortOrder")
SELECT defaults."degree", defaults."institution", defaults."period", defaults."details", defaults."status", defaults."sortOrder"
FROM (VALUES
	('BSc. Computer Science', 'Mizan-Tepi University · Ethiopia', '2022 — PRESENT', 'Foundations in software engineering, systems thinking, and reliable digital product design.', 'In progress', 0),
	('Engineering through building', 'Self-directed practice', 'CONTINUOUS PRACTICE', 'Product architecture, backend systems, accessible interfaces, and deployment workflows.', 'Ongoing', 1)
) AS defaults("degree", "institution", "period", "details", "status", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "education");
--> statement-breakpoint
INSERT INTO "certifications" ("title", "issuer", "date", "url", "sortOrder")
SELECT defaults."title", 'Portfolio work', defaults."date", NULL, defaults."sortOrder"
FROM (VALUES
	('Full-stack systems', 'Continuous', 0),
	('Product thinking', 'Continuous', 1),
	('Reliable delivery', 'Continuous', 2)
) AS defaults("title", "date", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "certifications");
--> statement-breakpoint
INSERT INTO "services" ("title", "description", "icon", "sortOrder")
SELECT defaults."title", defaults."description", defaults."icon", defaults."sortOrder"
FROM (VALUES
	('Build digital products', 'Full-stack web applications with clean architecture, responsive interfaces, and dependable backend systems.', 'Code2', 0),
	('Shape product experiences', 'Clear flows, purposeful interfaces, and design decisions that help people move with confidence.', 'Layers3', 1),
	('Make systems reliable', 'Authentication, data modeling, APIs, and deployment foundations built to grow without drama.', 'Database', 2)
) AS defaults("title", "description", "icon", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "services");
--> statement-breakpoint
INSERT INTO "journalEntries" ("category", "title", "excerpt", "sortOrder")
SELECT defaults."category", defaults."title", defaults."excerpt", defaults."sortOrder"
FROM (VALUES
	('Engineering', 'Designing a portfolio that can grow with the work', 'Why a professional site should be a living system, not a finished screenshot.', 0),
	('Backend', 'What makes an internal tool feel dependable', 'Small decisions around feedback, permissions, and data shape the whole experience.', 1)
) AS defaults("category", "title", "excerpt", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "journalEntries");
--> statement-breakpoint
INSERT INTO "socialAccounts" ("platform", "url", "sortOrder")
SELECT defaults."platform", defaults."url", defaults."sortOrder"
FROM (VALUES
	('GitHub', 'https://github.com/hiruykelemewor7774', 0),
	('LinkedIn', 'https://www.linkedin.com/in/alemu-kelemework/', 1)
) AS defaults("platform", "url", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "socialAccounts");
