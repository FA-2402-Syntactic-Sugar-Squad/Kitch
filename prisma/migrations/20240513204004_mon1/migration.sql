/*
  Warnings:

  - You are about to drop the column `dish` on the `Recipes` table. All the data in the column will be lost.
  - Added the required column `title` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipes" DROP COLUMN "dish",
ADD COLUMN     "title" TEXT NOT NULL;
