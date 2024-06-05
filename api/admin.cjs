const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const adminPrivRouter = express.Router();

const { verifyToken, requireAdmin } = require('./../auth/middleware.cjs');
const { adminPrivRatingsAndReviews, adminPrivDeleteReviewMsg, adminPrivUpdateRecipeImageUrl, updateDietaryInfoForRecipe } = require("../db/index.cjs");

adminPrivRouter.use(verifyToken);

//PATH: api/admin

/** USERS **/
//GET: all users
adminPrivRouter.get('/users', requireAdmin, async (req, res) => {
  try{
    const users = await prisma.users.findMany();
    res.send(users);
  }catch(error){
    console.log('Error fetching users', error);
  }
});


/** RATINGS & REVIEWS **/

//GET: ratings and reviews - All ratings and reviews  
adminPrivRouter.get('/', requireAdmin, async (req, res) => {
  try {
    const fetchAllRatingsAndReviews = await adminPrivRatingsAndReviews();
    if(!fetchAllRatingsAndReviews){
      return res.status(404).send({ message: "Ratings or reviews not found" });
    }
    res.send(fetchAllRatingsAndReviews);
  } catch (error) {
    console.error('Error getting ratings and reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT: review - Update a review to null (if inappropriate)
adminPrivRouter.put('/review/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedReviewMsg = await adminPrivDeleteReviewMsg(id);
    res.send(updatedReviewMsg);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**  RECIPES **/

//PUT: recipe - Update recipe img url
adminPrivRouter.put("/:recipeId", requireAdmin, async (req, res) => {
  try{
    const recipeId = parseInt(req.params.recipeId);
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    const newImageUrl = req.body.newImageUrl;
    
    const updatedImg = await adminPrivUpdateRecipeImageUrl(recipeId, newImageUrl);
    res.send(updatedImg);
  }catch(error){
    console.log("Error caught when updating an image on api", error);
  }
});

/** INGREDIENTS **/

//POST: ingredients - Create a new ingredient
adminPrivRouter.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const ingredient = await prisma.ingredients.create({
      data: { name, description, category }
    });
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error when creating ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT: ingredients - Update an existing ingredient by ID
adminPrivRouter.put("/ingredients/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;
    const updatedIngredient = await prisma.ingredients.update({
      where: { id: parseInt(id) },
      data: { name, description, category }
    });
    res.json(updatedIngredient);
  } catch (error) {
    console.error('Error when updating ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//DELETE: ingredients - Delete an ingredient by ID
adminPrivRouter.delete("/ingredients/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ingredients.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('Error when deleting ingredient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT: Dietary option
adminPrivRouter.put('/recipes/:recipeId/dietary-info', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const dietaryInfo = req.body;
    const updatedRecipe = await updateDietaryInfoForRecipe(parseInt(recipeId, 10), dietaryInfo);
    res.status(200).send(updatedRecipe);
  } catch (error) {
    console.error("Error caught when updating dietary information for recipe:", error);
    res.status(500).send({ message: "Failed to update dietary information" });
  }
});

module.exports = adminPrivRouter;