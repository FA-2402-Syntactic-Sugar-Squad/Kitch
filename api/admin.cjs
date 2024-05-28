const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const adminPrivRouter = express.Router();

const { verifyAdmin, verifyToken, requireAdmin } = require('./../auth/middleware.cjs');
const { adminPrivRatingsAndReviews, adminPrivDeleteReviewMsg, adminPrivUpdateRecipeImageUrl } = require("../db/index.cjs");

adminPrivRouter.use(verifyToken);

//PATH: api/admin

// GET: all ratings and reviews
adminPrivRouter.get('/', requireAdmin, async (req, res, next) => {
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

// Moderate (update) a review
adminPrivRouter.put('/review/:id', verifyAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updatedReviewMsg = await adminPrivDeleteReviewMsg(id);
    res.send(updatedReviewMsg);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//PUT - recipe image
adminPrivRouter.put("/:recipeId", verifyAdmin, async (req, res) => {
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

// POST /ingredients - Create a new ingredient
adminPrivRouter.post("/", verifyAdmin, async (req, res) => {
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

// PUT /ingredients/:id - Update an existing ingredient by ID
adminPrivRouter.put("/ingredients/:id", verifyAdmin, async (req, res, next) => {
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

// DELETE /ingredients/:id - Delete an ingredient by ID
adminPrivRouter.delete("/ingredients/:id", verifyAdmin, async (req, res, next) => {
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

module.exports = adminPrivRouter;