/*
  Warnings:

  - You are about to drop the column `estimatedTime` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `spentTime` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `_ProfileToTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `toDoProfileId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProfileToTask" DROP CONSTRAINT "_ProfileToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileToTask" DROP CONSTRAINT "_ProfileToTask_B_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "estimatedTime",
DROP COLUMN "spentTime",
ADD COLUMN     "parentTaskId" TEXT,
ADD COLUMN     "toDoProfileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProfileToTask";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_toDoProfileId_fkey" FOREIGN KEY ("toDoProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
