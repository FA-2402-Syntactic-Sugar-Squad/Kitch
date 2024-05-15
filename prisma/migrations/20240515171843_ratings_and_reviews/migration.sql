/*
  Warnings:

  - You are about to drop the column `rating` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `reviewmsg` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "rating",
DROP COLUMN "reviewmsg";

-- CreateTable
CREATE TABLE "ratingsAndReviews" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewMsg" TEXT NOT NULL,

    CONSTRAINT "ratingsAndReviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ratingsAndReviews" ADD CONSTRAINT "ratingsAndReviews_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
