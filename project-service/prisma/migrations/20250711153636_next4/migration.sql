/*
  Warnings:

  - Added the required column `projectIdCandidates` to the `UsersToProjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersToProjects" DROP CONSTRAINT "UsersToProjects_profileId_fkey";

-- AlterTable
ALTER TABLE "UsersToProjects" ADD COLUMN     "projectIdCandidates" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UsersToProjects" ADD CONSTRAINT "UsersToProjects_projectIdCandidates_fkey" FOREIGN KEY ("projectIdCandidates") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersToProjects" ADD CONSTRAINT "UsersToProjects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
