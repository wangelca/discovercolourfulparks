/*
  Warnings:

  - You are about to drop the column `bookingEndTime` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `calculatedAmount` on the `booking` table. All the data in the column will be lost.
  - Added the required column `bookingStatus` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `spotId` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_eventId_fkey";

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_spotId_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "bookingEndTime",
DROP COLUMN "calculatedAmount",
ADD COLUMN     "bookingStatus" TEXT NOT NULL,
ALTER COLUMN "spotId" SET NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spot"("spotId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
