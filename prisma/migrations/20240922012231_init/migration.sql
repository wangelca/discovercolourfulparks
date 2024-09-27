/*
  Warnings:

  - You are about to drop the column `location` on the `park` table. All the data in the column will be lost.
  - Made the column `description` on table `park` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "park" DROP COLUMN "location",
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "admin" (
    "adminId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "spot" (
    "spotId" SERIAL NOT NULL,
    "parkId" INTEGER NOT NULL,
    "spotName" TEXT NOT NULL,
    "spotDescription" TEXT NOT NULL,
    "spotHourlyRate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "spot_pkey" PRIMARY KEY ("spotId")
);

-- CreateTable
CREATE TABLE "event" (
    "eventId" SERIAL NOT NULL,
    "parkId" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "eventLocation" TEXT NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "booking" (
    "bookingId" SERIAL NOT NULL,
    "id" INTEGER NOT NULL,
    "spotId" INTEGER,
    "eventId" INTEGER,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "bookingTime" TIMESTAMP(3) NOT NULL,
    "calculatedAmount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("bookingId")
);

-- CreateTable
CREATE TABLE "payment" (
    "paymentId" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_bookingId_key" ON "payment"("bookingId");

-- AddForeignKey
ALTER TABLE "spot" ADD CONSTRAINT "spot_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "park"("parkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "park"("parkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "spot"("spotId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("eventId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("bookingId") ON DELETE RESTRICT ON UPDATE CASCADE;
