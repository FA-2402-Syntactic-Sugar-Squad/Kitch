-- CreateTable
CREATE TABLE "recipe_preference" (
    "recipeId" INTEGER NOT NULL,
    "preferenceId" INTEGER NOT NULL,

    CONSTRAINT "recipe_preference_pkey" PRIMARY KEY ("recipeId","preferenceId")
);

-- AddForeignKey
ALTER TABLE "recipe_preference" ADD CONSTRAINT "recipe_preference_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_preference" ADD CONSTRAINT "recipe_preference_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
