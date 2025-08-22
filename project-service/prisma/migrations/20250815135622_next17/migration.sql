/*
  Warnings:

  - You are about to drop the column `projectName` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `candidates` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "projectName";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "candidates";

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
