const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const ingredientsRouter = express.Router();

// GET /ingredients - Get all ingredients
ingredientsRouter.get("/", async (req, res, next) => {
  try {
    const ingredients = await prisma.ingredients.findMany();
    res.json(ingredients);
  } catch (error) {
    console.error('Error when getting ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /ingredients/:id - Get ingredient by ID
ingredientsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const ingredient = await prisma.ingredients.findUnique({
      where: { id: parseInt(id) }
    });
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    console.error('Error when getting ingredient by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /ingredients - Create a new ingredient
ingredientsRouter.post("/", async (req, res, next) => {
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
ingredientsRouter.put("/:id", async (req, res, next) => {
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
ingredientsRouter.delete("/:id", async (req, res, next) => {
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

module.exports = ingredientsRouter;