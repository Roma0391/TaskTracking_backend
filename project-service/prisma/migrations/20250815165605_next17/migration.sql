/*
  Warnings:

  - You are about to drop the column `candidateOfProjectId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `memberOfProjectId` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_candidateOfProjectId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_memberOfProjectId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "candidateOfProjectId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "memberOfProjectId",
ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
