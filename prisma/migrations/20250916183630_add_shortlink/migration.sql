/*
  Warnings:

  - A unique constraint covering the columns `[shortLink]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "shortLink" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Book_shortLink_key" ON "public"."Book"("shortLink");
