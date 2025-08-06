/*
  Warnings:

  - You are about to drop the `UsersToTasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersToTasks" DROP CONSTRAINT "UsersToTasks_profileId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToTasks" DROP CONSTRAINT "UsersToTasks_taskId_fkey";

-- DropTable
DROP TABLE "UsersToTasks";

-- CreateTable
CREATE TABLE "_ProfileToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileToTask_B_index" ON "_ProfileToTask"("B");

-- AddForeignKey
ALTER TABLE "_ProfileToTask" ADD CONSTRAINT "_ProfileToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTask" ADD CONSTRAINT "_ProfileToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
