/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `_ProjectToCandidates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToMembers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateOfProjectId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberOfProjectId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToCandidates" DROP CONSTRAINT "_ProjectToCandidates_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToCandidates" DROP CONSTRAINT "_ProjectToCandidates_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToMembers" DROP CONSTRAINT "_ProjectToMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToMembers" DROP CONSTRAINT "_ProjectToMembers_B_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "candidateOfProjectId" TEXT NOT NULL,
ADD COLUMN     "memberOfProjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "creatorId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "priorityLevel" DROP DEFAULT;

-- DropTable
DROP TABLE "_ProjectToCandidates";

-- DropTable
DROP TABLE "_ProjectToMembers";

-- CreateIndex
CREATE UNIQUE INDEX "Task_title_key" ON "Task"("title");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_memberOfProjectId_fkey" FOREIGN KEY ("memberOfProjectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_candidateOfProjectId_fkey" FOREIGN KEY ("candidateOfProjectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
