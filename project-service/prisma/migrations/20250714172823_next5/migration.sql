/*
  Warnings:

  - You are about to drop the `CandidatesToProjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersToProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidatesToProjects" DROP CONSTRAINT "CandidatesToProjects_profileId_fkey";

-- DropForeignKey
ALTER TABLE "CandidatesToProjects" DROP CONSTRAINT "CandidatesToProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToProjects" DROP CONSTRAINT "UsersToProjects_profileId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToProjects" DROP CONSTRAINT "UsersToProjects_projectId_fkey";

-- DropTable
DROP TABLE "CandidatesToProjects";

-- DropTable
DROP TABLE "UsersToProjects";

-- CreateTable
CREATE TABLE "_ProjectToMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectToCandidates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToCandidates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectToMembers_B_index" ON "_ProjectToMembers"("B");

-- CreateIndex
CREATE INDEX "_ProjectToCandidates_B_index" ON "_ProjectToCandidates"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToMembers" ADD CONSTRAINT "_ProjectToMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToMembers" ADD CONSTRAINT "_ProjectToMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToCandidates" ADD CONSTRAINT "_ProjectToCandidates_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToCandidates" ADD CONSTRAINT "_ProjectToCandidates_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
