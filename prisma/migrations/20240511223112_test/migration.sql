-- CreateTable
CREATE TABLE "recipe" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageType" TEXT NOT NULL,

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ingredientTorecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ingredientTorecipe_AB_unique" ON "_ingredientTorecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_ingredientTorecipe_B_index" ON "_ingredientTorecipe"("B");

-- AddForeignKey
ALTER TABLE "_ingredientTorecipe" ADD CONSTRAINT "_ingredientTorecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ingredientTorecipe" ADD CONSTRAINT "_ingredientTorecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
