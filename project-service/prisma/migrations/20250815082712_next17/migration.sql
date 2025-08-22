/*
  Warnings:

  - You are about to drop the column `priorityLavel` on the `Project` table. All the data in the column will be lost.
  - Added the required column `priorityLevel` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "priorityLavel",
ADD COLUMN     "priorityLevel" TEXT NOT NULL;
