const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { fetchRecipeData } = require("../db/index.cjs");
const express = require("express")
const recipesRouter = express.Router();

// GET: Check if recipe is favorite for a user
recipesRouter.get("/check-favorite-recipe", async (req, res, next) => {
  try {
    const { userId, recipeId } = req.query;
    if (!userId || !recipeId) {
      return res.status(400).json({ error: "User ID or recipe ID missing" });
    }
    const userRecipeRecord = await prisma.users_recipes.findFirst({
      where: {
        userId: parseInt(userId),
        recipeId: parseInt(recipeId),
      },
    });
    const isFavorite = !!userRecipeRecord;
    res.json({ isFavorite });
  } catch (error) {
    console.error("Error checking if recipe is favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

// GET all recipes 
recipesRouter.get('/', async (req, res, next) => {
  try {
    const recipes = await prisma.recipes.findMany({
      include: {
        ratingsAndReviews: true
      }
  });
    res.json(recipes);
  } catch (error) {
    console.error('Error when getting recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET recipe details by ID - COMMENTED THIS OUT BC LINE 9-30 DOES THE SAME THING
// recipesRouter.get('/:id', async (req, res, next) => {
//   try {
//     const recipeId = parseInt(req.params.id);

//     // Fetch the recipe data using Prisma's findUnique method
//     const recipe = await prisma.recipes.findUnique({
//       where: { id: recipeId },
//     });

//     if (!recipe) {
//       return res.status(404).json({ error: 'Recipe not found' });
//     }

//     res.json(recipe);
//   } catch (error) {
//     console.error('Error when getting recipe by ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

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