/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `preferences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "preferences" ALTER COLUMN "glutenFree" SET DEFAULT false,
ALTER COLUMN "ketogenic" SET DEFAULT false,
ALTER COLUMN "lactoVegetarian" SET DEFAULT false,
ALTER COLUMN "ovoVegetarian" SET DEFAULT false,
ALTER COLUMN "vegan" SET DEFAULT false,
ALTER COLUMN "pescetarian" SET DEFAULT false,
ALTER COLUMN "paleo" SET DEFAULT false,
ALTER COLUMN "primal" SET DEFAULT false,
ALTER COLUMN "lowFODMAP" SET DEFAULT false,
ALTER COLUMN "whole30" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "preferences_userId_key" ON "preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
