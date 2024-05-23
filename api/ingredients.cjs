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

//search ingrediens by name
ingredientsRouter.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    
    const ingredients = await prisma.ingredients.findMany({
      where: {
        name: {
          contains: query, 
          mode: 'insensitive' 
        }
      }
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error when searching for ingredients:', error);
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


module.exports = ingredientsRouter;