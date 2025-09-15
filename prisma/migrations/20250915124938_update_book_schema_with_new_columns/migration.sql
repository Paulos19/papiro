/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `pages` on the `Book` table. All the data in the column will be lost.
  - Added the required column `conditionDescription` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Made the column `publisher` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationYear` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Book" DROP COLUMN "coverImageUrl",
DROP COLUMN "description",
DROP COLUMN "isFeatured",
DROP COLUMN "pages",
ADD COLUMN     "binding" TEXT,
ADD COLUMN     "bookType" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "conditionDescription" TEXT NOT NULL,
ADD COLUMN     "edition" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "weightInGrams" INTEGER,
ALTER COLUMN "publisher" SET NOT NULL,
ALTER COLUMN "publicationYear" SET NOT NULL;
