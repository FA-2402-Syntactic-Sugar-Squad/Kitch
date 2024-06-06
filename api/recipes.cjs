const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { createRatingForRecipe, createReviewForRecipe } = require("../db/index.cjs");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
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

// GET all recipes - Existing endpoint was modified to handle both all recipes and filtered recipes 
recipesRouter.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Fetch user preferences
      const user = await prisma.users.findUnique({
        where: { id: userId },
        include: { preferences: true },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const preferences = user.preferences[0];

      const filters = Object.entries(preferences)
        .filter(([key, value]) => value === true)
        .reduce((acc, [key]) => {
          acc[key] = true;
          return acc;
        }, {});

      // Filter recipes based on user preferences
      const recipes = await prisma.recipes.findMany({
        where: {
          AND: filters
        },
        include: {
          ratingsAndReviews: true,
        },
      });

      return res.status(200).send(recipes);
    } else {
      const recipes = await prisma.recipes.findMany({
        include: {
          ratingsAndReviews: true,
        },
      });
      return res.status(200).send(recipes);
    }
  } catch (error) {
    console.error("Error when getting recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// //test
// recipesRouter.get("/:recipeName", async (req,res,next) => {
//   try{
//     const recipeName = req.params.recipeName;
//     const singleRecipe = await fetchRecipeData(recipeName);
//     res.send(singleRecipe);
//   }catch(error){
//     console.log('Error when getting recipes', error);
//   }
// });

// POST: Create rating for a recipe
recipesRouter.post("/:recipeId/ratings", async (req, res) => {
  try {
    const { rating } = req.body;
    const recipeId = parseInt(req.params.recipeId);

    const createdRating = await createRatingForRecipe(recipeId, rating);
    res.send(createdRating);
  } catch (error) {
    console.log("Error caught when creating rating for recipe:", error);
    res.status(500).send({ message: "Failed to create rating" });
  }
});

// POST: Create review for a recipe
recipesRouter.post("/:recipeId/reviews", async (req, res) => {
  try {
    const { reviewMsg } = req.body;
    const recipeId = parseInt(req.params.recipeId);

    const createdReview = await createReviewForRecipe(recipeId, reviewMsg);
    res.send(createdReview);
  } catch (error) {
    console.log("Error caught when creating review for recipe:", error);
    res.status(500).send({ message: "Failed to create review" });
  }
});

module.exports = recipesRouter;