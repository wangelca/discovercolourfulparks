/*
  Warnings:

  - You are about to drop the column `eventDate` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `eventTime` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `publicMetadata` on the `users` table. All the data in the column will be lost.
  - Added the required column `description` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `park` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotDiscount` to the `spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotLocation` to the `spot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ALTER COLUMN "bookingTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "event" DROP COLUMN "eventDate",
DROP COLUMN "eventTime",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "park" ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "spot" ADD COLUMN     "spotDiscount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "spotLocation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
DROP COLUMN "publicMetadata";
