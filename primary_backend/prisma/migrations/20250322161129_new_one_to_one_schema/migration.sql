/*
  Warnings:

  - You are about to drop the column `triggerId` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the column `triggerId` on the `Zap` table. All the data in the column will be lost.
  - Added the required column `availableTriggerId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_triggerId_fkey";

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "triggerId",
ADD COLUMN     "availableTriggerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "triggerId";

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_availableTriggerId_fkey" FOREIGN KEY ("availableTriggerId") REFERENCES "AvailableTriggers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
