-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'BUYER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'BUYER';
