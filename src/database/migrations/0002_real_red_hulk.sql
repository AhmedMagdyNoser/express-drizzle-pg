ALTER TABLE "loans" ALTER COLUMN "loan_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "loan_date" SET DEFAULT now();