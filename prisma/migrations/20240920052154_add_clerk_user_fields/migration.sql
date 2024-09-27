/*
  Warnings:

  - You are about to drop the column `firstname` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstname",
ADD COLUMN     "firstName" TEXT;
