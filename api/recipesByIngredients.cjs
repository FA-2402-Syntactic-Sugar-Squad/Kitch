const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const recipeByIngredientRouter = express.Router();

// GET /recipes/byIngredient/:ingredientId - Get recipes by ingredientId
recipeByIngredientRouter.get("/:ingredientId", async (req, res, next) => {
  try {
    const { ingredientId } = req.params;

    // Query the recipes_ingredients table to find recipes by ingredientId
    const recipesWithIngredient = await prisma.recipe.findMany({
      where: {
        ingredients: {
          some: {
            ingredientId: parseInt(ingredientId)
          }
        }
      }
    });

    // Return the recipes found
    res.json(recipesWithIngredient);
  } catch (error) {
    console.error('Error when getting recipes by ingredientId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = recipeByIngredientRouter;