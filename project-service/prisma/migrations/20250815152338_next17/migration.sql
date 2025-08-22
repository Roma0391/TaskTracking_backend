/*
  Warnings:

  - You are about to drop the column `adminProfileId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `userFirstName` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `userLastName` on the `Candidate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateOfProjectId` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_projectId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "adminProfileId",
DROP COLUMN "projectId",
DROP COLUMN "userEmail",
DROP COLUMN "userFirstName",
DROP COLUMN "userLastName",
ADD COLUMN     "candidateOfProjectId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_candidateOfProjectId_fkey" FOREIGN KEY ("candidateOfProjectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
