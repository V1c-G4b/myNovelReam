ALTER TABLE "chapters" ADD COLUMN "file_path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "file_type" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "novels" ADD COLUMN "cover_image_path" text;--> statement-breakpoint
ALTER TABLE "chapters" DROP COLUMN "content";