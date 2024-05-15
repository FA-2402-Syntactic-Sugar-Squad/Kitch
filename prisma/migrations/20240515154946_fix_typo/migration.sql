/*
  Warnings:

  - You are about to drop the column `revivewmsg` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "revivewmsg",
ADD COLUMN     "reviewmsg" TEXT;
