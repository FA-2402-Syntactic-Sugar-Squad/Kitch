const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const apiKey = '67d97bb0c30f43d5840b1867b0757815';

async function updateMissingImageUrls() {
  try {
    // Find all recipes that don't have an imageUrl
    const recipesWithoutImageUrl = await prisma.recipes.findMany({
      where: {
        imageurl: null,
      },
    });

    // Iterate through each recipe and update the imageUrl
    for (const recipe of recipesWithoutImageUrl) {
      const recipeId = recipe.id;

      try {
        // Fetch recipe information from the API
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const imageurl = response.data.image;

        // Update the recipe with the fetched imageUrl
        await prisma.recipes.update({
          where: { id: recipeId },
          data: { imageurl: imageurl },
        });

        console.log(`Recipe "${recipe.title}" updated with imageUrl!`);
      } catch (error) {
        console.error(`Error fetching/updating imageUrl for recipe ID ${recipeId}:`, error);
      }
    }

    console.log('Image URL update process completed!');
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMissingImageUrls();
