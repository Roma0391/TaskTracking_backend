-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_toDoProfileId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "toDoProfileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_toDoProfileId_fkey" FOREIGN KEY ("toDoProfileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
