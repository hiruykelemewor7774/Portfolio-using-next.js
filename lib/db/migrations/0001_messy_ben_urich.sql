CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"issuer" text NOT NULL,
	"date" text NOT NULL,
	"url" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"degree" text NOT NULL,
	"institution" text NOT NULL,
	"period" text NOT NULL,
	"details" text NOT NULL,
	"status" text DEFAULT 'In progress' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"organization" text NOT NULL,
	"period" text NOT NULL,
	"description" text NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
