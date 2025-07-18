/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[createdById]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_createdBy_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_createdById_key" ON "Profile"("createdById");
