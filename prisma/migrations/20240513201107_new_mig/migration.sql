/*
  Warnings:

  - You are about to drop the `_ingredientTorecipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ingredientTorecipe" DROP CONSTRAINT "_ingredientTorecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_ingredientTorecipe" DROP CONSTRAINT "_ingredientTorecipe_B_fkey";

-- DropTable
DROP TABLE "_ingredientTorecipe";

-- DropTable
DROP TABLE "ingredient";

-- DropTable
DROP TABLE "recipe";

-- CreateTable
CREATE TABLE "Recipes_Ingredients" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "ingredientsId" INTEGER NOT NULL,

    CONSTRAINT "Recipes_Ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users_Recipes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "rating" INTEGER,
    "reviewMsg" TEXT,

    CONSTRAINT "Users_Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "GlutenFree" BOOLEAN NOT NULL,
    "Ketogenic" BOOLEAN NOT NULL,
    "LactoVegetarian" BOOLEAN NOT NULL,
    "OvoVegetarian" BOOLEAN NOT NULL,
    "Vegan" BOOLEAN NOT NULL,
    "Pescetarian" BOOLEAN NOT NULL,
    "Paleo" BOOLEAN NOT NULL,
    "Primal" BOOLEAN NOT NULL,
    "LowFODMAP" BOOLEAN NOT NULL,
    "Whole30" BOOLEAN NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "dish" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "servings" INTEGER NOT NULL,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Recipes_Ingredients" ADD CONSTRAINT "Recipes_Ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipes_Ingredients" ADD CONSTRAINT "Recipes_Ingredients_ingredientsId_fkey" FOREIGN KEY ("ingredientsId") REFERENCES "Ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users_Recipes" ADD CONSTRAINT "Users_Recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users_Recipes" ADD CONSTRAINT "Users_Recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
