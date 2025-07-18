/*
  Warnings:

  - You are about to drop the column `permissions` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "permissions",
ADD COLUMN     "permisionStatus" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "role" SET DEFAULT 'user';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "startDate",
ALTER COLUMN "status" SET DEFAULT 'active',
ALTER COLUMN "priorityLavel" SET DEFAULT 'medium';
