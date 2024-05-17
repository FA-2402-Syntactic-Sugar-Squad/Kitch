const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const apiKey = '67d97bb0c30f43d5840b1867b0757815';

async function updateRecipesWithKeywords() {
  try {
    // Find all recipes
    const allRecipes = await prisma.recipes.findMany();

    // Iterate through each recipe
    for (const recipe of allRecipes) {
      const recipeId = recipe.id;

      try {
        // Fetch recipe information from the API
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const keywords = response.data;

        // Create an object to hold the update data
        const updateData = {};

        // Check each keyword and update only if the value is true
        if (keywords.glutenFree) updateData.glutenFree = true;
        if (keywords.ketogenic) updateData.ketogenic = true;
        if (keywords.lactoVegetarian) updateData.lactoVegetarian = true;
        if (keywords.ovoVegetarian) updateData.ovoVegetarian = true;
        if (keywords.vegan) updateData.vegan = true;
        if (keywords.pescetarian) updateData.pescetarian = true;
        if (keywords.paleo) updateData.paleo = true;
        if (keywords.primal) updateData.primal = true;
        if (keywords.lowFodmap) updateData.lowFODMAP = true;
        if (keywords.whole30) updateData.whole30 = true;

        // Special case for lacto ovo vegetarian
        if (keywords.diets && keywords.diets.includes('lacto ovo vegetarian')) {
          updateData.lactoVegetarian = true;
          updateData.ovoVegetarian = true;
        }

        // Update the recipe with the fetched keywords
        if (Object.keys(updateData).length > 0) {
          await prisma.recipes.update({
            where: { id: recipeId },
            data: updateData,
          });

          console.log(`Recipe "${recipe.title}" updated with keywords!`);
        }
      } catch (error) {
        console.error(`Error updating keywords for recipe ID ${recipeId}:`, error);
      }
    }

    console.log('Keyword update process completed!');
  } catch (error) {
    console.error('Error updating keywords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRecipesWithKeywords();
