/*
  Warnings:

  - A unique constraint covering the columns `[createdBy]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "createdBy" TEXT NOT NULL,
ALTER COLUMN "permisionStatus" SET NOT NULL,
ALTER COLUMN "permisionStatus" DROP DEFAULT,
ALTER COLUMN "permisionStatus" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_createdBy_key" ON "Profile"("createdBy");
