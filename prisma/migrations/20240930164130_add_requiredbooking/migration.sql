-- AlterTable
ALTER TABLE "event" ADD COLUMN     "requiredbooking" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "spot" ADD COLUMN     "requiredbooking" BOOLEAN NOT NULL DEFAULT false;
