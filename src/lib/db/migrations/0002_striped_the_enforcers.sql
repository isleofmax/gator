ALTER TABLE "feeds" DROP CONSTRAINT "feeds_name_unique";--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_url_unique" UNIQUE("url");