-- AlterTable
ALTER TABLE "spot" ADD COLUMN     "latitude" DECIMAL(65,30),
ADD COLUMN     "longitude" DECIMAL(65,30),
ADD COLUMN     "spotImageUrl" TEXT[];
