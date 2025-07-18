/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `parentTaskId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentTaskId_fkey";

-- DropIndex
DROP INDEX "Project_createdBy_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdBy",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ALTER COLUMN "priorityLavel" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "parentTaskId",
ALTER COLUMN "status" SET DEFAULT 'todo',
ALTER COLUMN "priorityLevel" SET DEFAULT 'medium';

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
