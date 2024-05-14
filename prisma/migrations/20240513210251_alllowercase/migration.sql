/*
  Warnings:

  - You are about to drop the `Ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipes_Ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users_Recipes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Preferences" DROP CONSTRAINT "Preferences_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recipes_Ingredients" DROP CONSTRAINT "Recipes_Ingredients_ingredientsId_fkey";

-- DropForeignKey
ALTER TABLE "Recipes_Ingredients" DROP CONSTRAINT "Recipes_Ingredients_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Users_Recipes" DROP CONSTRAINT "Users_Recipes_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Users_Recipes" DROP CONSTRAINT "Users_Recipes_userId_fkey";

-- DropTable
DROP TABLE "Ingredients";

-- DropTable
DROP TABLE "Preferences";

-- DropTable
DROP TABLE "Recipes";

-- DropTable
DROP TABLE "Recipes_Ingredients";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "Users_Recipes";

-- CreateTable
CREATE TABLE "recipes_ingredients" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "ingredientsId" INTEGER NOT NULL,

    CONSTRAINT "recipes_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isadmin" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_recipes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "rating" INTEGER,
    "reviewMsg" TEXT,

    CONSTRAINT "users_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "glutenFree" BOOLEAN NOT NULL,
    "ketogenic" BOOLEAN NOT NULL,
    "lactoVegetarian" BOOLEAN NOT NULL,
    "ovoVegetarian" BOOLEAN NOT NULL,
    "vegan" BOOLEAN NOT NULL,
    "pescetarian" BOOLEAN NOT NULL,
    "paleo" BOOLEAN NOT NULL,
    "primal" BOOLEAN NOT NULL,
    "lowFODMAP" BOOLEAN NOT NULL,
    "whole30" BOOLEAN NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "servings" INTEGER NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "recipes_ingredients_ingredientsId_fkey" FOREIGN KEY ("ingredientsId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_recipes" ADD CONSTRAINT "users_recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_recipes" ADD CONSTRAINT "users_recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
