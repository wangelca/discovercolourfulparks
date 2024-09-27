/*
  Warnings:

  - You are about to drop the column `bookingTime` on the `booking` table. All the data in the column will be lost.
  - Added the required column `bookingEndTime` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingStartTime` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "bookingTime",
ADD COLUMN     "bookingEndTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "bookingStartTime" TIMESTAMP(3) NOT NULL;
