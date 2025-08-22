/*
  Warnings:

  - You are about to drop the column `candidateOfProjectId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_candidateOfProjectId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "candidateOfProjectId",
DROP COLUMN "createdById";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "candidates" TEXT[];

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userFirstName" TEXT NOT NULL,
    "userLastName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);
