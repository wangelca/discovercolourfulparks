/*
  Warnings:

  - You are about to drop the column `endTime` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "eventImageUrl" TEXT[],
ADD COLUMN     "parameters" TEXT;
