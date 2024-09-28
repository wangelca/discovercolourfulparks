/*
  Warnings:

  - You are about to drop the column `latitude` on the `spot` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `spot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "spot" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "parameters" TEXT;
