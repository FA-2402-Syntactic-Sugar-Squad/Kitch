const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { fetchRecipeData } = require("../db/index.cjs");
const express = require("express")
const recipesRouter = express.Router();

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