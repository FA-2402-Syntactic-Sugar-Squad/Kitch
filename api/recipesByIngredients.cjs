const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const recipeByIngredientRouter = express.Router();

// // GET /recipes/byIngredient/:ingredientId - Get recipes by ingredientId
// recipeByIngredientRouter.get("/:ingredientId", async (req, res, next) => {
//   try {
//     const { ingredientId } = req.params;

//     // Query the recipes_ingredients table to find recipes by ingredientId
//     const recipesWithIngredient = await prisma.recipes.findMany({
//       where: {
//         recipes_ingredients: {
//           some: {
//             ingredientsId: parseInt(ingredientId)
//           }
//         }
//       }
//     });

//     // Return the recipes found
//     res.json(recipesWithIngredient);
//   } catch (error) {
//     console.error('Error when getting recipes by ingredientId:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// GET /recipes/byIngredient/:ingredientIds - Get recipes by multiple ingredientIds
recipeByIngredientRouter.get("/:ingredientIds", async (req, res, next) => {
  try {
    const ingredientIds = req.params.ingredientIds.split(',').map(id => parseInt(id));

    
    const recipesWithIngredients = await prisma.recipes.findMany({
      where: {
        recipes_ingredients: {
          some: {
            ingredientsId: {
              in: ingredientIds
            }
          }
        }
      },
      include: {
        recipes_ingredients: true
      }
    });

    
    const filteredRecipes = recipesWithIngredients.filter(recipe => {
      const recipeIngredientIds = recipe.recipes_ingredients.map(ri => ri.ingredientsId);
      return ingredientIds.every(id => recipeIngredientIds.includes(id));
    });

    res.json(filteredRecipes); 
  } catch (error) {
    console.error('Error when getting recipes by ingredientIds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = recipeByIngredientRouter;