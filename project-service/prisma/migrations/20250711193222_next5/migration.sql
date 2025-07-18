/*
  Warnings:

  - You are about to drop the column `projectIdCandidates` on the `UsersToProjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersToProjects" DROP CONSTRAINT "UsersToProjects_projectIdCandidates_fkey";

-- AlterTable
ALTER TABLE "UsersToProjects" DROP COLUMN "projectIdCandidates";

-- CreateTable
CREATE TABLE "CandidatesToProjects" (
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidatesToProjects_pkey" PRIMARY KEY ("projectId","profileId")
);

-- AddForeignKey
ALTER TABLE "CandidatesToProjects" ADD CONSTRAINT "CandidatesToProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidatesToProjects" ADD CONSTRAINT "CandidatesToProjects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
