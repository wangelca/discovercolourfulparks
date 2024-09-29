/*
  Warnings:

  - You are about to drop the column `id` on the `booking` table. All the data in the column will be lost.
  - You are about to alter the column `calculatedAmount` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `id` on the `payment` table. All the data in the column will be lost.
  - Added the required column `userId` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "id",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "calculatedAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "id",
ADD COLUMN     "userId" INTEGER NOT NULL;
