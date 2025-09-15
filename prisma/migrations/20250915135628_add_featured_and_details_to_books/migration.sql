-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pages" INTEGER;
