CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"loan_date" date DEFAULT now() NOT NULL,
	"return_date" date
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;