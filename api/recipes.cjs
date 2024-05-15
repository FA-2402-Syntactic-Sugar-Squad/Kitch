const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { fetchRecipeData } = require("../db/index.cjs");
const express = require("express")
const recipesRouter = express.Router();

// GET single recipe by ID
recipesRouter.get("/:recipeId", async (req, res, next) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    
    // Fetch the recipe data using Prisma's findUnique method
    const recipe = await prisma.recipes.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      // If the recipe is not found, send a 404 Not Found response
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Send the recipe data as a response
    res.json(recipe);
  } catch (error) {
    // If an error occurs, log the error and send a 500 Internal Server Error response
    console.error('Error when getting recipe by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//test
recipesRouter.get("/:recipeName", async (req,res,next) => {
  try{
    const recipeName = req.params.recipeName;
    const singleRecipe = await fetchRecipeData(recipeName);
    res.send(singleRecipe);
  }catch(error){
    console.log('Error when getting recipes', error);
  }
});

module.exports = recipesRouter;