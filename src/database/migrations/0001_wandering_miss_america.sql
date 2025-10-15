ALTER TABLE "loans" ALTER COLUMN "loan_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "loan_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "return_date" SET DATA TYPE timestamp;